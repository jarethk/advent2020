Part 1 was fun, use a dynamic RegExp with "g" global search flag to get a count of the character in the password string.  Given that I'm parsing the input using a javascript regex, I have to remember to convert the min/max to number.

Part 2 was simpler.  No regex, just check the characters at specific positions, and do an exclusive OR to check that it wasn't both matching.
