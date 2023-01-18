Each letter is a "yes" answer, answers are grouped but might have duplicates.  The duplicates are a key that we need to use a Set to count the "yes" answers. 

Part 1 - group the inputs by blank lines, and stuff each character into a Set.  Then just capture the size of each set.

Part 2 - shift from using a simple Set to an object tracking the count of each letter, filter the list where the count is the num lines/people, and keep that size.