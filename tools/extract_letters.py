from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "letters_4k"
SHEETS = OUT / "sheets"
CONTACTS = OUT / "contact_sheets"

# Each tuple is (letter, left, top, right, bottom). The boxes follow the
# layouts in the supplied alphabet sheets; transparent pixels are trimmed
# again inside every box below.
LAYOUTS = {
    "图6": {
        "source": Path(r"C:\Users\H\Desktop\图6.png"),
        "rows": [
            ("ABCD", 0, 300, 4, [(0, 330), (330, 605), (605, 890), (890, 1280)]),
            ("EFGHI", 300, 590, 5, [(0, 250), (250, 500), (500, 770), (770, 1030), (1030, 1280)]),
            ("JKLM", 590, 875, 4, [(0, 300), (300, 610), (610, 940), (940, 1280)]),
            ("NOPQ", 875, 1170, 4, [(0, 300), (300, 620), (620, 930), (930, 1280)]),
            ("RSTUV", 1170, 1465, 5, [(0, 290), (290, 560), (560, 850), (850, 1080), (1080, 1280)]),
            ("WXYZ", 1465, 1726, 4, [(0, 320), (320, 690), (690, 1000), (1000, 1280)]),
        ],
    },
    "图5": {
        "source": Path(r"C:\Users\H\Desktop\图5.png"),
        "rows": [
            ("ABCDE", 0, 290, 5, [(0, 260), (260, 500), (500, 790), (790, 1035), (1035, 1272)]),
            ("FGHIJ", 290, 600, 5, [(0, 250), (250, 505), (505, 830), (830, 1050), (1050, 1272)]),
            ("KLMNO", 600, 900, 5, [(0, 240), (240, 500), (500, 800), (800, 1050), (1050, 1272)]),
            ("PQRST", 900, 1195, 5, [(0, 250), (250, 520), (520, 800), (800, 1050), (1050, 1272)]),
            ("UVWX", 1195, 1480, 4, [(0, 260), (260, 570), (570, 950), (950, 1272)]),
            ("YZ", 1480, 1684, 2, [(0, 320), (320, 700)]),
        ],
    },
    "图3": {
        "source": Path(r"C:\Users\H\Desktop\图3.png"),
        "rows": [
            ("AB", 0, 260, 2, [(250, 460), (460, 700)]),
            ("CDEFGH", 260, 540, 6, [(0, 150), (150, 300), (300, 460), (460, 620), (620, 770), (770, 919)]),
            ("IJKLMN", 540, 800, 6, [(0, 150), (150, 300), (300, 460), (460, 620), (620, 770), (770, 919)]),
            ("OPQRST", 800, 1080, 6, [(0, 150), (150, 300), (300, 460), (460, 620), (620, 770), (770, 919)]),
            ("UVWXYZ", 1080, 1346, 6, [(0, 150), (150, 300), (300, 460), (460, 620), (620, 770), (770, 919)]),
        ],
    },
    "图2": {
        "source": Path(r"C:\Users\H\Desktop\图2.png"),
        "rows": [
            ("ABCDE", 0, 190, 5, [(0, 123), (123, 246), (246, 369), (369, 492), (492, 614)]),
            ("FGHIJ", 190, 365, 5, [(0, 123), (123, 246), (246, 369), (369, 492), (492, 614)]),
            ("KLMNO", 365, 545, 5, [(0, 123), (123, 246), (246, 369), (369, 492), (492, 614)]),
            ("PQRST", 545, 710, 5, [(0, 123), (123, 246), (246, 369), (369, 492), (492, 614)]),
            ("UVWXY", 710, 838, 5, [(0, 123), (123, 246), (246, 369), (369, 492), (492, 614)]),
        ],
    },
    "图层0": {
        "source": Path(r"C:\Users\H\Desktop\图层 0.png"),
        "rows": [
            ("ABCDE", 0, 300, 5, [(0, 250), (250, 500), (500, 750), (750, 1000), (1000, 1234)]),
            ("FGHIJ", 300, 575, 5, [(0, 250), (250, 500), (500, 750), (750, 1000), (1000, 1234)]),
            ("KLMN", 575, 860, 4, [(0, 300), (300, 620), (620, 930), (930, 1234)]),
            ("OPQR", 860, 1130, 4, [(0, 300), (300, 620), (620, 930), (930, 1234)]),
            ("STUV", 1130, 1420, 4, [(0, 300), (300, 620), (620, 930), (930, 1234)]),
            ("WXYZ", 1420, 1648, 4, [(0, 300), (300, 620), (620, 930), (930, 1234)]),
        ],
    },
}

LABEL_ROWS = {
    "图6": ["ABCD", "EFGHI", "JKLM", "NOPQ", "RSTUV", "WXYZ"],
    "图5": ["ABCDE", "FGHIJ", "KLMNO", "PQRST", "UVWX", "YZ"],
    "图3": ["AB", "CDEFGH", "IJKLMN", "OPQRST", "UVWXYZ"],
    "图2": ["ABCDE", "FGHIJ", "KLMNO", "PQRST", "UVWXY"],
    "图层0": ["ABCDE", "FGHIJ", "KLMN", "OPQR", "STUV", "WXYZ"],
}

MIN_COMPONENT_AREA = {"图6": 8000, "图5": 8000, "图3": 4000, "图2": 4000, "图层0": 4000}


def row_boxes(row, image: Image.Image):
    letters, top, bottom, columns, *custom = row
    if custom:
        ranges = custom[0]
        if isinstance(ranges, list):
            for letter, (left, right) in zip(letters, ranges):
                yield letter, (left, top, right, bottom)
        else:
            left, right = ranges
            yield letters[0], (left, top, right, bottom)
        return
    width = image.width
    # Find the lowest-alpha vertical gap near each expected divider. This
    # prevents a letter that is offset inside its grid cell from being sliced.
    alpha = np.asarray(image.getchannel("A").crop((0, top, width, bottom)))
    projection = (alpha >= 8).sum(axis=0).astype(np.float32)
    if projection.size >= 9:
        projection = np.convolve(projection, np.ones(9, dtype=np.float32) / 9, mode="same")
    dividers = [0]
    for divider in range(1, columns):
        expected = divider * width / columns
        window = max(30, int(width * 0.18))
        start = max(1, int(expected - window))
        end = min(width - 1, int(expected + window))
        split = start + int(np.argmin(projection[start:end]))
        # Keep boundaries strictly increasing even when a row has almost no
        # visible pixels near an expected divider.
        if split <= dividers[-1] + 4:
            split = round(expected)
        split = max(dividers[-1] + 1, min(width - (columns - divider), split))
        dividers.append(split)
    dividers.append(width)
    for index, letter in enumerate(letters):
        yield letter, (dividers[index], top, dividers[index + 1], bottom)


def trim_alpha(image: Image.Image, threshold: int = 8) -> Image.Image:
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return image.copy()
    # A tiny transparent safety margin avoids cutting anti-aliased edge pixels.
    pad = 3
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(image.width, bbox[2] + pad)
    bottom = min(image.height, bbox[3] + pad)
    return image.crop((left, top, right, bottom))


def find_letter_boxes(
    image: Image.Image,
    row_labels: list[str],
    row_bands: list[tuple[int, int]],
    min_area: int,
) -> list[tuple[str, tuple[int, int, int, int]]]:
    """Find the main connected artwork in each row, ignoring loose confetti."""
    import cv2

    alpha = np.asarray(image.getchannel("A"))
    mask = (alpha >= 8).astype("uint8") * 255
    _, _, stats, _ = cv2.connectedComponentsWithStats(mask)
    components = []
    for x, y, width, height, area in stats[1:]:
        if int(area) >= min_area:
            components.append((int(x), int(y), int(width), int(height), int(area)))

    # Use the known row bands from the source layout, but choose by area when
    # a loose decorative piece happens to fall in the same band.
    result = []
    for labels, (row_top, row_bottom) in zip(row_labels, row_bands):
        in_row = [
            item
            for item in components
            if row_top <= item[1] + item[3] / 2 < row_bottom
        ]
        if len(in_row) != len(labels):
            # A few source sheets have two vertically adjacent letters whose
            # outlines touch (for example O/T in 图5). Re-segment only that
            # row so the shared component is split at the row boundary.
            local_mask = mask[row_top:row_bottom]
            _, _, local_stats, _ = cv2.connectedComponentsWithStats(local_mask)
            in_row = []
            for x, y, width, height, area in local_stats[1:]:
                if int(area) >= max(600, min_area // 8):
                    in_row.append((int(x), int(y) + row_top, int(width), int(height), int(area)))
        # If decorative pieces survive the area threshold, keep the largest
        # expected number and restore left-to-right order.
        in_row = sorted(in_row, key=lambda item: item[4], reverse=True)[: len(labels)]
        in_row.sort(key=lambda item: item[0])
        if len(in_row) != len(labels):
            raise RuntimeError(f"Expected {len(labels)} letters in y={row_top}:{row_bottom}, found {len(in_row)}")
        for letter, (x, y, width, height, _) in zip(labels, in_row):
            result.append((letter, (x, y, x + width, y + height)))
    return result


def fit_on_canvas(image: Image.Image, size: int = 2048, margin: int = 110) -> Image.Image:
    image = trim_alpha(image).convert("RGBA")
    usable = size - margin * 2
    scale = min(usable / image.width, usable / image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    resized = image.resize(target, Image.Resampling.LANCZOS)
    resized = ImageEnhance.Sharpness(resized).enhance(1.12)
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    canvas.alpha_composite(resized, ((size - target[0]) // 2, (size - target[1]) // 2))
    return canvas


def make_sheet(image: Image.Image, max_edge: int = 3840) -> Image.Image:
    scale = max_edge / max(image.size)
    target = (round(image.width * scale), round(image.height * scale))
    if target == image.size:
        return image.copy()
    return image.resize(target, Image.Resampling.LANCZOS)


def make_contact_sheet(images: list[tuple[str, Image.Image]], tile: int = 300) -> Image.Image:
    columns = 5
    rows = (len(images) + columns - 1) // columns
    contact = Image.new("RGBA", (columns * tile, rows * (tile + 36)), (248, 248, 248, 255))
    for index, (letter, image) in enumerate(images):
        x = (index % columns) * tile
        y = (index // columns) * (tile + 36)
        thumb = ImageOps.contain(image, (tile - 24, tile - 24), Image.Resampling.LANCZOS)
        contact.alpha_composite(thumb, (x + (tile - thumb.width) // 2, y + (tile - thumb.height) // 2))
        # Keep the preview dependency-free: labels are encoded in the filename
        # and the contact sheet is only a visual QA aid.
    return contact.convert("RGB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    SHEETS.mkdir(parents=True, exist_ok=True)
    CONTACTS.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, list[str]] = {}

    for name, spec in LAYOUTS.items():
        source = spec["source"]
        image = Image.open(source).convert("RGBA")
        source_dir = OUT / name
        source_dir.mkdir(parents=True, exist_ok=True)
        generated: list[tuple[str, Image.Image]] = []
        letters: list[str] = []

        row_labels = LABEL_ROWS[name]
        row_bands = [(row[1], row[2]) for row in spec["rows"]]
        for letter, box in find_letter_boxes(image, row_labels, row_bands, MIN_COMPONENT_AREA[name]):
            crop = image.crop(box)
            result = fit_on_canvas(crop)
            result.save(source_dir / f"{letter}.png", compress_level=6)
            generated.append((letter, result))
            letters.append(letter)

        make_sheet(image).save(SHEETS / f"{name}_upscaled.png", compress_level=6)
        make_contact_sheet(generated).save(CONTACTS / f"{name}.jpg", quality=92)
        manifest[name] = letters

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({key: len(value) for key, value in manifest.items()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
