Part 1 - fairly straightforward.  This is a simple math problem.  For each bus get the mod from the depart time, find the gap between the mod and the value, and pick the shortest.

Part 2 - this one was a bit tougher.  We have to find a point in time where all the buses arrive one right after the other.  This is easiest to think of by starting with 2 buses.  You watch the first one arrive multiple times, and stop when the second bus is right be hind it.  Let's call this point T.  Now add another bus into the mix.  We know that the first two buses will line up at repetitions based on multiplying their arrival times (because they are primes) starting with point T.  Let's call this increment D.  So we keep checking back every increment D to see if the third bus lines up.  When it does, that is our new point T.  And we need to update increment D by multiplying in the arrival time of  the third bus.  Keep doing this for every additional bus, skipping the 'x' buses for efficiency.