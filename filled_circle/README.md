# Filled Circle

## Description

This program generates a filled circle using emojis in a text-based grid. It creates a visual representation of a circle by calculating the distance of each grid point from a center point and filling points within a specified radius.

## Usage

Run the program using Deno:

```
deno run filled_circle.js [width] [height] [centerX] [centerY] [radius]
```

Parameters (all optional):

- `width`: Width of the grid (default: 30)
- `height`: Height of the grid (default: 30)
- `centerX`: X-coordinate of the center (default: 15)
- `centerY`: Y-coordinate of the center (default: 15)
- `radius`: Radius of the circle (default: 13)

Example:

```
deno run filled_circle.js 40 40 20 20 15
```

## Experiment

Try changing the dimensions of the grid, the center point, and the radius to create different sized circles. You can also modify the code to use different characters or emojis for the filled and empty spaces.

## Key Concepts to Explore

1. **Euclidean Distance** - The program calculates the distance between points using the Pythagorean theorem (sqrt(x² + y²)).
2. **Cartesian Coordinate System** - The program uses a grid system with x and y coordinates to position elements.
3. **Circle Equation** - A point is inside a circle if its distance from the center is less than or equal to the radius.
4. **Visual Representation** - Converting mathematical concepts into visual patterns.

### Real-world Applications

- **Computer Graphics** - Similar algorithms are used to draw shapes in graphical user interfaces and video games
- **Image Processing** - Circle detection algorithms are used in medical imaging to identify cells or in industrial applications for quality control
- **GIS Systems** - Geographic Information Systems use similar distance calculations to create buffer zones around points of interest
- **Game Development** - Collision detection often relies on distance calculations between objects

Try modifying the code to create other shapes like ellipses or rings (circles with an inner and outer radius)!
