from PIL import Image

src = r'E:\StartUp Project (FOODLINE CAMPUS)\PPT OTHER TASKES\frontend\public\_logo_source.png'
out = r'E:\StartUp Project (FOODLINE CAMPUS)\PPT OTHER TASKES\frontend\public\logo.png'

im = Image.open(src).convert('RGBA')
crop = im.crop((78, 58, 292, 300))
pixels = crop.load()
w, h = crop.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        # Remove charcoal/black background
        if brightness < 55 and max(r, g, b) < 70:
            pixels[x, y] = (0, 0, 0, 0)
            continue
        # Soft dark grey that is not orange
        if brightness < 85 and max(r, g, b) < 100:
            is_orange = r > 140 and g > 50 and r > b
            if not is_orange:
                pixels[x, y] = (0, 0, 0, 0)

bbox = crop.getbbox()
if bbox:
    crop = crop.crop(bbox)

side = max(crop.size) + 20
canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
ox = (side - crop.size[0]) // 2
oy = (side - crop.size[1]) // 2
canvas.paste(crop, (ox, oy), crop)
final = canvas.resize((512, 512), Image.Resampling.LANCZOS)
final.save(out, 'PNG')
print('saved', out, final.size)
