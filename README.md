# Card Game

### Rules of Set
This card selection game is inspired by the classic SET! Card game. A game consists of a board of cards. Each card has one of three options for 4 different "attributes":

| Attribute | **Options**  | | |
|-------    |---------|---------|----------|
| STYLE     | solid   | outline | striped  |
| COLOR     | green   | purple  | red      |
| SHAPE     | diamond | oval    | squiggle |
| COUNT     | 1       | 2       | 3        |

The goal of the game is to find as many "Sets" of 3 cards such that for each attribute, all cards share the attribute or no cards share the attribute. For example, the following three cards build a Set because none share style, color, or shape attributes but they all share the count attribute.

<p>
  <img src="https://courses.cs.washington.edu/courses/cse154/23au/homework/hw2/screenshots/set-example.png" width="50%" alt="Example of something that is a set">
</p>


However, the following three cards do not form a Set since the color attribute does not follow the "all or none" requirement (purple is shared by the first and third card, but not the second).

<p>
  <img src="https://courses.cs.washington.edu/courses/cse154/23au/homework/hw2/screenshots/not-set-example.png" width="50%" alt="Example of something that is not a Set">
</p>
