Part 1 - This seems to be a process of elimination problem, not necessarily that complicated.  We ultimately want a count of the ingredients not mapped to an allergen.  So we'll keep a few arrays.  First, keep a named array for each allergen, and as we parse each new list of foods we filter out anything from prior list for that allergen that is not in the new list, or if no existing list then create new one.  Second, keep a list of ingredients that have been confirmed as allergens, treat that as an exclusion list, and filter those out of all other lists.  Last, keep a list of everything, and at the end filter out anything that is in the exclusion list.

Part 2 - since we already have named arrays for the allergens, sort our group of named allergens by the names, map to the ingredient, and return that list.