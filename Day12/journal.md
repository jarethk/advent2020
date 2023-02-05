Part 1 - we're in a boat being tossed around.  We need some utilities to handle compass directions, turning, and changing position based on direction and amount we're moving.  

Part 2 - instead of the boat moving around, we're moving the waypoint.  And instead of turning, we pivot the the waypoint around 0,0.  When we get the instruction to move we loop over waypoint and add that to our position.