Part 1, read the grid, loop through adding the move values in each loop, and num-wrap the x coord.  I really need to publish the num-wrap as an npm module, would be easier for reuse.

Part 2 just needed to do a small refactor to put the base processing in a loop and call that for each slope, with a map-reduce to multiply the results.