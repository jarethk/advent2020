Validating passports?

Part 1 - collect the passport parts into arrays.  Use a global regex to part the input on key:value, which then sort, and split on the color.  Then if they have 8 entries, we can validate the parts in order, or if they have 7 parts we validate for all but cid, again in-order.

Part 2 - add routines to validate each of the values with a simple regex.

168 -- too low
180 -- too high
179 -- not sure why...