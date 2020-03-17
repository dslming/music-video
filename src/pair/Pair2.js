; (function (scope) {

    var maleColors = new Shuffler([
        0x824199,
        0xE71F49,
        0x15B366,
        0xFBED00,
        0xF47C20,
        0x027AC0,
        0x04bab5
    ]);

    var femaleColors = new Shuffler([
        0x555555,
        0x555555,
        0xaaaaaa,
        0xffffff,
        0xffffff
    ]);

    scope.Pair = Composition(

        Group,

        {

            sparkleSeed: { type: 'v4', value: new THREE.Vector4() },
            count: 0,
            maleInitialDistance: 180,
            maleColors: maleColors,
            femaleColors: femaleColors,
            defaultFogDistance: 10000,
            fogUniforms: {
                far: { type: 'f', value: null },
            },
            setFogDistance: function (v) {
                Pair.fogUniforms.far.value = v;
            }
        },

        function () {

            var sizeFemale = 10 * 2;
            var sizeMale = random(3, 5) * 2;

            var factoryFemale = factoriesFemale.next();
            var factoryMale = factoriesMale.next();

            var geometryFemale = factoryFemale(sizeFemale);
            var geometryMale = factoryMale(sizeMale);

            geometryMale.applyMatrix(matrix4.makeRotationX(Math.PI / 2));
            geometryMale.applyMatrix(matrix4.makeRotationZ(random(Math.PI * 2)));
            geometryMale.applyMatrix(matrix4.makeTranslation(0, 0, sizeFemale * 0.75));

            euler.set(random(Math.PI / 4), random(Math.PI / 4), random(Math.PI / 4));
            this.eulerFemale = euler.clone();
            geometryFemale.applyMatrix(matrix4.makeRotationFromEuler(euler));

            var bspFemale = new ThreeBSP(geometryFemale);
            var bspMale = new ThreeBSP(geometryMale);

            bspFemale = bspFemale.subtract(bspMale);
            var subtractedFemale = bspFemale.toGeometry();

            this.colorMale = maleColors.next();
            this.colorFemale = femaleColors.next();

            this.male = strokeMesh(geometryMale, this.colorMale);
            this.female = strokeMesh(subtractedFemale, this.colorFemale);

            this.add(this.male);
            this.add(this.female);

            this.id = Pair.count++;

            this.reset();

            Object.defineProperty(this, 'sparkle', {

                get: function () {
                    return this.female.material.uniforms.sparkleStrength.value;
                },
                set: function (v) {
                    this.female.material.uniforms.sparkleStrength.value = v;
                }

            });

        },

        {

            reset: function () {

                this.visible = true;
                this.marked = false;
                this.rotation.reorder('XYZ');

                this.add(this.male);
                this.add(this.female);

                this.position.set(0, 0, 0);
                this.rotation.set(0, 0, 0);
                this.scale.set(1, 1, 1);

                this.male.visible = false;
                this.male.position.set(0, 0, Pair.maleInitialDistance);
                this.male.rotation.set(0, 0, 0);
                this.male.scale.set(1, 1, 1);

                this.female.visible = true;
                this.female.position.set(0, 0, 0);
                this.female.rotation.set(0, 0, 0);
                this.female.scale.set(1, 1, 1);

                this.matrixAutoUpdate = true;
                this.male.matrixAutoUpdate = true;
                this.female.matrixAutoUpdate = true;

                this.strokeInflate(1);
                this.sparkle = 0;

            },

            strokeInflate: function (v) {

                this.male.material.uniforms.strokeInflate.value = v;
                this.female.material.uniforms.strokeInflate.value = v;

            },

            jump: function (y) {

                y = y || 0;

                return new TimelineLite()
                    .fromTo(this.position, 0.1, { y: -300 + y }, { y: y, ease: Expo.easeInOut, immediateRender: true }, -0.1)
                    .to(this.position, 0.3, { y: 2 + y, ease: Linear.easeNone })
                    .to(this.position, 0.5, { y: -500 + y, ease: Expo.easeIn });

            },
            jump2: function (y) {

                y = y || 0;

                return new TimelineLite()
                    .fromTo(this.position, 0.3, { y: -300 + y }, { y: y, ease: Expo.easeInOut, immediateRender: true }, -0.3)
                    .fromTo(this.scale, 0.3, { y: 1.1, x: 0.9, z: 0.9 }, { y: 1, x: 1, z: 1, ease: Expo.easeInOut, immediateRender: true }, -0.3)
                    .to(this.position, 0.1, { y: 1 + y, ease: Quad.easeOut })
                    .to(this.position, 0.5, { y: -500 + y, ease: Expo.easeIn }, '+=0.4');

            },
            straightenMale: function () {

            },
            straightenFemale: function () {
                this.female.quaternion.setFromEuler(this.eulerFemale).inverse();
                this.male.quaternion.setFromEuler(this.eulerFemale).inverse();
            },

            insert: function (speed, maleScale, femaleScale) {

                speed = speed || 1;

                maleScale = maleScale || 1;
                femaleScale = femaleScale || 1;

                return new TimelineLite()

                    .set(this.male, { visible: true }, 0)
                    .to(this.male.position, 0.4 / speed, { z: -4 * femaleScale, ease: Expo.easeIn }, 0)
                    .to(this.male.scale, 0.2 / speed, { z: maleScale, ease: Back.easeOut }, 0)

                    .to(this.female.position, 0.25 / speed, { z: -2.8 * femaleScale, ease: Back.easeOut }, 0.4 / speed)

                    .to(this.female.scale, 0.01 / speed, { z: femaleScale * 0.3, ease: Back.easeOut }, 0.4 / speed)
                    .to(this.female.scale, 0.13 / speed, { z: femaleScale, ease: Back.easeOut }, 0.41 / speed)

                    .to(this.male.scale, 0.01 / speed, { z: maleScale * 0.8, ease: Back.easeOut }, 0.4 / speed)
                    .to(this.male.scale, 0.1 / speed, { z: maleScale, ease: Back.easeOut }, 0.41 / speed)

            },

            insert3: function (speed, maleScale, femaleScale) {

                speed = speed || 1;

                maleScale = maleScale || 1;
                femaleScale = femaleScale || 1;

                var mz = -4 * femaleScale;
                var fz = -2.8 * femaleScale;

                var rx = random(0.4, 0.8) * random.sign();

                return new TimelineLite()

                    .set(this.male, { visible: true }, 0)
                    .to(this.male.position, 0.4 / speed, { z: mz, ease: Expo.easeIn }, 0)
                    .to(this.male.scale, 0.2 / speed, { z: maleScale, ease: Back.easeOut }, 0)

                    .to(this.female.position, 0.25 / speed, { z: fz, ease: Back.easeOut }, 0.4 / speed)

                    .to(this.female.scale, 0.01 / speed, { z: femaleScale * 0.3, ease: Back.easeOut }, 0.4 / speed)
                    .to(this.female.scale, 0.13 / speed, { z: femaleScale, ease: Back.easeOut }, 0.41 / speed)

                    .to(this.male.scale, 0.01 / speed, { z: maleScale * 0.8, ease: Back.easeOut }, 0.4 / speed)
                    .to(this.male.scale, 0.1 / speed, { z: maleScale, ease: Back.easeOut }, 0.41 / speed)

                    .to(this.female.position, 0.5 / speed, { z: mz - 30, ease: Quint.easeOut }, 0.4 / speed)
                    .to(this.male.position, 0.5 / speed, { z: fz - 30, ease: Quint.easeOut }, 0.41 / speed)

                    .to(this.female.rotation, 0.5 / speed, { x: rx, ease: Quint.easeOut }, 0.4 / speed)
                    .to(this.male.rotation, 0.5 / speed, { x: rx, ease: Quint.easeOut }, 0.41 / speed)

            },

            insert2: function (speed, maleScale, femaleScale) {

                speed = speed || 1;

                maleScale = maleScale || 1;
                femaleScale = femaleScale || 1;

                return new TimelineLite()

                    .set(this.male, { visible: true }, 0)
                    .to(this.male.position, 0.4 / speed, { z: 1.5 * maleScale, ease: Expo.easeIn }, 0)

                    .to(this.position, 0.16 / speed, { z: this.position.z - 50.8 * femaleScale, ease: Circ.easeOut }, 0.405 / speed)

                    .to(this.female.scale, 0.01 / speed, { z: femaleScale * 0.8, ease: Back.easeOut }, 0.4 / speed)
                    .to(this.female.scale, 0.3 / speed, { z: femaleScale, ease: Back.easeOut }, 0.51 / speed)

                    .to(this.male.scale, 0.01 / speed, { z: maleScale * 0.8, ease: Back.easeOut }, 0.4 / speed)
                    .to(this.male.scale, 0.3 / speed, { z: maleScale, ease: Back.easeOut }, 0.51 / speed)

            }

        }

    );

    var matrix4 = new THREE.Matrix4();
    var euler = new THREE.Euler();
    var material;

    var factoriesFemale = new Shuffler([
        function (size) { return new THREE.CylinderGeometry(size / 2, size / 2, 20, random.int(3, 7)) },
        function (size) { return new THREE.BoxGeometry(size, size, size) },
        function (size) { return new THREE.BoxGeometry(size, size, size / 3); },
        function (size) {
            var g = new THREE.CylinderGeometry(size, size, size / 1.25, 3);
            g.applyMatrix(matrix4.makeRotationY(Math.PI));
            g.applyMatrix(matrix4.makeRotationX(Math.PI / 2));
            return g;
        }
    ]);

    var factoriesMale = new Shuffler([
        function (size) { return new THREE.CylinderGeometry(size, size / 2, random(25, 40), random.int(3, 5)) },
        function (size) { return new THREE.CylinderGeometry(size, 0.1, random(35, 40), random.int(3, 5)) },
        function (size) { return new THREE.BoxGeometry(size * 4, size * 4, size / 2) },
        function (size) { return new THREE.BoxGeometry(size * 4, size * 4, size / 2) },
        function (size) {
            var g = new THREE.CylinderGeometry(size * 2, size * 2, size / 2, 3);
            g.applyMatrix(matrix4.makeRotationX(Math.PI / 2));
            return g;
        }
    ]);

    function strokeMesh(geometry, color) {


        var tex1 = Assets('texture!textures/pastel.gif');
        var tex2 = Assets('texture!textures/pastel2.jpg');



        material = material || new THREE.ShaderMaterial({
            vertexShader: Assets('shaders/pair.vs'),
            fragmentShader: Assets('shaders/pair.fs'),
            uniforms: {
                color: { type: 'c', value: null },
                center: { type: 'v3', value: null },
                strokeInflate: { type: 'f', value: null },
                sparkleStrength: { type: 'f', value: null },
                sparkle1: { type: 't', value: null },
                sparkle2: { type: 't', value: null },
                sparkleSeed: Pair.sparkleSeed
            },
            attributes: {
                vertexNormal: { type: 'v3', value: null }
            },
            shading: THREE.FlatShading
        });

        var myMaterial = material.clone();


        geometry.computeBoundingSphere();

        myMaterial.uniforms.sparkle1.value = tex1;
        myMaterial.uniforms.sparkle2.value = tex2;
        myMaterial.uniforms.sparkleStrength.value = 0;
        myMaterial.uniforms.sparkleSeed = Pair.sparkleSeed;


        myMaterial.uniforms.center.value = geometry.boundingSphere.center;
        myMaterial.uniforms.color.value = new THREE.Color(color);

        geometry = strokeGeometry(geometry);

        return new THREE.Mesh(geometry, myMaterial);

    }

    function strokeGeometry(geometry) {

        var g = geometry.clone();

        for (var face, t, i = 0, l = g.faces.length; i < l; i++) {

            face = g.faces[i];
            t = face.a;
            face.a = face.c;
            face.c = t;

            face.vertexNormals.reverse();
            face.vertexColors.reverse();


        }

        g.merge(geometry);
        // trigger face normals
        g.faces[0].vertexNormals.length = 0;

        g = new THREE.BufferGeometry().fromGeometry(g);
        g.computeVertexNormals();

        var normals = g.attributes.normal.array;
        for (var i = 0; i < normals.length / 2; i++) {
            normals[i] *= 500;
        }

        return g;

    }
})(this);
