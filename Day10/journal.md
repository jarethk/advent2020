Part 1 - we have to use every value, so create an array with numbers, add 0 and max+3 to the array, and sort it.  A quick map to calculate the differences between the values, a reducer to group the values.

Part 2 - this one is a bit more complex.  I started with thinking this is power of 2 for every place in our difference map with a value of 1.  That drives the values too high.  So look again at the sections of the difference map with the 1's.  How many paths can we create depends on how many 1's we have in the group.  Let's look at a few

// section of 1 ones, has 1 possible path
1

// section of 2 ones, has 1 possible path
1, 2

// section of 3 ones, has 2 possible paths
1, 2, 3
1, 3

// section of 4 ones, has 4 possible paths
1, 2, 3, 4
1, 2, 4
1, 3, 4
1, 4

// section of 5 ones, has 7 possible paths
1, 2, 3, 4, 5
1, 3, 4, 5
1, 2, 4, 5
1, 2, 3, 5
1, 2, 5
1, 3, 5
1, 4, 5

// section of 6 ones, has 13 possible paths
1, 2, 3, 4, 5, 6
1, 3, 4, 5, 6
1, 2, 4, 5, 6
1, 2, 3, 5, 6
1, 2, 3, 4, 6
1, 3, 5, 6
1, 3, 4, 6
1, 2, 4, 6
1, 2, 5, 6
1, 2, 3, 6
1, 4, 5, 6
1, 3, 6
1, 4, 6
 
So that is 1, 1, 2, 4, 7, 13.  Seems fibonnaci like, a pattern actually is tribonacci.  

So if we take our differences map, turn the 3's into 0, group/sum the 1's, turn that into a value from the tribonacci sequence, and multiply those together.