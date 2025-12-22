# 3D Models Required

This directory should contain three 3D model files for the FluidGlass component:

- `lens.glb` - Lens-shaped glass model
- `bar.glb` - Bar/rectangular glass model
- `cube.glb` - Cubic glass model

## Where to get the models:

You can:

1. Create custom models in Blender and export as `.glb`
2. Download free models from:
   - [Sketchfab](https://sketchfab.com/) (filter by "Downloadable")
   - [Poly Pizza](https://poly.pizza/)
   - [CGTrader Free Models](https://www.cgtrader.com/free-3d-models)

## Model Requirements:

- Format: `.glb` (Binary glTF)
- Reasonable polygon count (< 10k faces recommended)
- Clean geometry for transmission material
- Centered at origin (0,0,0)

## Quick Start (Temporary):

For testing, you can create simple placeholder meshes or the component will throw errors until models are added.
