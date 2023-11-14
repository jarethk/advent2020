Part 1 - seems like a fairly straight-forward cycle.  They talk like a circle queue, but the current cup is always going to be "next in line" so we can just keep shifting off the front.  Take off the first as the current, slice off the next 3 as the 3 moving, and figure out where those 3 get inserted, then add the current to the end of the queue.

Part 2 - and now we get to it.  We have an array of a million numbers instead of just 9, and have to do 10 million cycles instead of 100.  If we just brute force it then it could take a very long time to run.  So we're going to need to do some detection of cycles/patterns.  But that wasn't working.  So I had to make the algorithm much more efficient.  In part 1 I was doing a lot of shifting, splicing, pushing, which are fine in small volumes.  When you're doing this will arrays that are 1m long, and doing 10m cycles, it adds up.  So treat the array itself like a linked list, each index in the array represents a number from the string, and the value is the next number.  Had to test the new algorithm with part 1, which took a bit to get right, but then for part 2 with all the extra values the way I was building the list had issues, so it took a couple tries to get that right.  Fully working, and it all runs in about 2 seconds.