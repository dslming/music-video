var PairPool = Singleton( 

    Pool,

    {

        create: function() {
            return new Pair();
        }

    }

);