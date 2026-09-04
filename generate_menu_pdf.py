"""Generate the Espace Beach Ahoué menu PDF using Pillow."""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(BASE, "assets", "images")
MENU_DIR = os.path.join(IMG_DIR, "menu")
OUT = os.path.join(BASE, "assets", "Espace_Beach_Ahoue_Menu.pdf")

# A4 at 150 DPI
W, H = 1240, 1754

# Colors
BG = (18, 18, 18)
CARD = (30, 30, 30)
ALT = (26, 26, 26)
GOLD = (255, 215, 0)
TEXT = (245, 237, 229)
MUTED = (212, 196, 176)
WHITE = (255, 255, 255)
GOLD_BORDER = (184, 134, 11)

# Fonts
def get_font(size, bold=False):
    names = ["arialbd.ttf", "arial.ttf"] if bold else ["arial.ttf", "arialbd.ttf"]
    for n in names:
        for p in [os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", n),
                  os.path.join("C:\\Windows", "Fonts", n)]:
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def get_georgia(size, bold=False):
    names = ["georgiab.ttf", "georgia.ttf", "georgiaz.ttf"] if bold else ["georgia.ttf", "georgiab.ttf"]
    for n in names:
        for p in [os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", n),
                  os.path.join("C:\\Windows", "Fonts", n)]:
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return get_font(size, bold)


def load_img(path, max_w=None, max_h=None):
    try:
        im = Image.open(path).convert("RGBA")
        if max_w or max_h:
            w, h = im.size
            r = min((max_w / w if max_w else 999), (max_h / h if max_h else 999), 1)
            im = im.resize((int(w * r), int(h * r)), Image.LANCZOS)
        return im
    except Exception:
        return None


def paste_img(page, path, x, y, w, h):
    im = load_img(path, w, h)
    if im:
        im = im.resize((w, h), Image.LANCZOS)
        page.paste(im, (x, y), im if im.mode == "RGBA" else None)


def rounded_rect(draw, xy, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = xy
    r = radius
    if fill:
        draw.rectangle([x0 + r, y0, x1 - r, y1], fill=fill)
        draw.rectangle([x0, y0 + r, x1, y1 - r], fill=fill)
        draw.pieslice([x0, y0, x0 + 2*r, y0 + 2*r], 180, 270, fill=fill)
        draw.pieslice([x1 - 2*r, y0, x1, y0 + 2*r], 270, 360, fill=fill)
        draw.pieslice([x0, y1 - 2*r, x0 + 2*r, y1], 90, 180, fill=fill)
        draw.pieslice([x1 - 2*r, y1 - 2*r, x1, y1], 0, 90, fill=fill)
    if outline:
        draw.arc([x0, y0, x0 + 2*r, y0 + 2*r], 180, 270, fill=outline, width=width)
        draw.arc([x1 - 2*r, y0, x1, y0 + 2*r], 270, 360, fill=outline, width=width)
        draw.arc([x0, y1 - 2*r, x0 + 2*r, y1], 90, 180, fill=outline, width=width)
        draw.arc([x1 - 2*r, y1 - 2*r, x1, y1], 0, 90, fill=outline, width=width)
        draw.line([x0 + r, y0, x1 - r, y0], fill=outline, width=width)
        draw.line([x0 + r, y1, x1 - r, y1], fill=outline, width=width)
        draw.line([x0, y0 + r, x0, y1 - r], fill=outline, width=width)
        draw.line([x1, y0 + r, x1, y1 - r], fill=outline, width=width)


def center_text(draw, text, y, font, fill, page_w=W):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((page_w - tw) // 2, y), text, font=font, fill=fill)


def section_title(draw, text, y):
    f = get_georgia(42, bold=True)
    center_text(draw, text, y, f, GOLD)
    draw.rectangle([(W // 2 - 60), y + 52, (W // 2 + 60), y + 55], fill=GOLD)
    return y + 70


def sub_title(draw, text, y):
    f = get_georgia(30, bold=True)
    center_text(draw, text, y, f, GOLD)
    return y + 42


def draw_card(page, draw, img_path, name, price, desc, x, y, cw, ch):
    rounded_rect(draw, (x, y, x + cw, y + ch), 12, fill=CARD)
    rounded_rect(draw, (x, y, x + cw, y + ch), 12, outline=GOLD_BORDER + (30,), width=2)

    img_h = ch - 90
    paste_img(page, img_path, x + 4, y + 4, cw - 8, img_h)

    ty = y + img_h + 12
    nf = get_font(22, bold=True)
    pf = get_font(18, bold=True)

    name_display = name if len(name) <= 30 else name[:28] + "..."
    draw.text((x + 10, ty), name_display, font=nf, fill=TEXT)

    price_text = f"{price} FCFA"
    pbbox = draw.textbbox((0, 0), price_text, font=pf)
    pw = pbbox[2] - pbbox[0]
    draw.text((x + cw - pw - 10, ty), price_text, font=pf, fill=GOLD)

    if desc:
        df = get_font(14)
        ty += 30
        lines = []
        words = desc.split()
        line = ""
        for word in words:
            test = (line + " " + word).strip()
            tbbox = draw.textbbox((0, 0), test, font=df)
            if tbbox[2] - tbbox[0] < cw - 24:
                line = test
            else:
                lines.append(line)
                line = word
        if line:
            lines.append(line)
        for ln in lines[:3]:
            draw.text((x + 10, ty), ln, font=df, fill=MUTED)
            ty += 18


def draw_list_item(draw, name, price, x, y, w):
    nf = get_font(16)
    pf = get_font(16, bold=True)
    draw.text((x, y), name, font=nf, fill=TEXT)

    price_text = f"{price} FCFA"
    pbbox = draw.textbbox((0, 0), price_text, font=pf)
    pw = pbbox[2] - pbbox[0]
    draw.text((x + w - pw, y), price_text, font=pf, fill=GOLD)

    # Dotted line
    name_bbox = draw.textbbox((0, 0), name, font=nf)
    name_w = name_bbox[2] - name_bbox[0]
    dots_x = x + name_w + 8
    dots_end = x + w - pw - 8
    for dx in range(int(dots_x), int(dots_end), 10):
        draw.rectangle([dx, y + 12, dx + 3, y + 13], fill=(255, 255, 255, 40))

    return y + 30


def draw_box(draw, title, items, x, y, w):
    line_h = 30
    box_h = len(items) * line_h + 40
    rounded_rect(draw, (x, y, x + w, y + box_h), 10, fill=ALT)
    rounded_rect(draw, (x, y, x + w, y + box_h), 10, outline=(212, 175, 55, 50), width=2)

    tf = get_georgia(20, bold=True)
    tbbox = draw.textbbox((0, 0), title, font=tf)
    tw = tbbox[2] - tbbox[0]
    draw.text(((W - tw) // 2, y + 8), title, font=tf, fill=GOLD)

    iy = y + 36
    for item in items:
        iy = draw_list_item(draw, item["name"], item["price"], x + 14, iy, w - 28)
    return y + box_h + 12


# ==================== DATA ====================
MENU = {
    "specialites": [
        {"name": "Marmite du pecheur", "price": "15 000", "img": "marmite_pecheur_1.jpg", "desc": "Crevettes, poisson carpe, servi avec du riz ou de l'attiéké."},
        {"name": "La Villageoise", "price": "15 000", "img": "la_villageoise.jpg", "desc": "Escargots, écrevisses, champignons. Un incontournable généreux."},
        {"name": "Brochettes d'Agoutis", "price": "7 000", "img": "brochette_agouti.jpg", "desc": "Marinés avec une sauce locale, grillés pour une cuisson parfaite."},
    ],
    "poissons": [
        {"name": "Soupe de Machoiron", "price": "7 000", "img": "soupe_machoiron.jpg", "desc": "Délicieux plat à base d'ingrédients frais."},
        {"name": "Carpe Braisée", "price": "5 000", "img": "poisson_braise.jpg", "desc": "Poisson carpe charnu braisé, avec accompagnement au choix."},
        {"name": "Poisson Fumé", "price": "5 000", "img": "poisson_fumé.jpg", "desc": "Classique du littoral ivoirien, avec attiéké et garniture."},
    ],
    "poissonsExtra": [
        {"name": "Poisson Sosso sauté ou au four", "price": "5 000 - 8 000"},
        {"name": "Poisson Sole braisé ou sautée", "price": "5 000"},
    ],
    "crustaces": [
        {"name": "Gambas sautées", "price": "10 000", "img": "gambas_sauté.jpg", "desc": "Gambas fraîches marinées, poêlées ou au four."},
        {"name": "Ecrevisses au four", "price": "5 000", "img": "ecrevisses.jpg", "desc": "Ecrevisses fraîches, cuites au four avec épices."},
        {"name": "Escargot sauté", "price": "5 000", "img": "escargot_sauté.jpg", "desc": "Un \"Must to see\", une saveur sans commentaires."},
    ],
    "crustacesExtra": [
        {"name": "Brochettes d'escargots", "price": "Sur demande"},
    ],
    "viandes": [
        {"name": "Choukouya de mouton", "price": "10 000", "img": "choukouya_mouton.jpg", "desc": "Mijotée patiemment, tendresse et goût succulent."},
        {"name": "1/4 Kedjenou hérisson", "price": "7 000", "img": "kedjenou_herisson.jpg", "desc": "Gibier local noble, saveur sauvage exaltée."},
        {"name": "Rat palmiste braisé", "price": "6 000", "img": "rat_palmiste.jpg", "desc": "Chair douce et savoureuse, un vrai délice."},
    ],
    "viandesExtra": [
        {"name": "Côtelette d'agneau", "price": "10 000"},
        {"name": "Côte de bœuf", "price": "10 000"},
        {"name": "Côte de porc grillé", "price": "9 000"},
        {"name": "Choukouya de porc", "price": "9 000"},
        {"name": "Sauté de queue de bœuf", "price": "9 000"},
        {"name": "¼ Agoutif", "price": "7 000"},
        {"name": "Mangouste", "price": "7 000"},
        {"name": "Rat de brousse", "price": "6 000"},
        {"name": "Ecureuil", "price": "4 000"},
    ],
    "volailles": [
        {"name": "Riz Soumara au Poulet", "price": "9 000", "img": "riz_soumara_poulet.jpg", "desc": "Saveur atypique du soumara qui fouettera vos papilles."},
        {"name": "Kedjenou de pintade", "price": "8 000", "img": "kedjenou_pintade_2.jpg", "desc": "Volaille mijotée avec les meilleurs épices locales."},
        {"name": "Poulet braisé", "price": "7 000", "img": "poulet_braisé.jpg", "desc": "L'incontournable local, saveur exaltée par les flammes."},
    ],
    "volaillesExtra": [
        {"name": "Riz Soumara pintade", "price": "10 000"},
        {"name": "Riz cantonnais pintade", "price": "10 000"},
        {"name": "Riz cantonnais au poulet", "price": "9 000"},
        {"name": "Pintade braisée", "price": "8 000"},
        {"name": "Pintade sautée", "price": "8 000"},
        {"name": "Poulet sauté", "price": "7 000"},
        {"name": "Kédjénou de poulet", "price": "7 000"},
        {"name": "Caille braisée", "price": "5 000"},
        {"name": "Caille sautée", "price": "5 000"},
        {"name": "Kedjenou de Caille", "price": "5 000"},
        {"name": "Perdrix braisée", "price": "4 000"},
        {"name": "Perdrix sautée", "price": "4 000"},
        {"name": "Kedjenou de Perdrix", "price": "4 000"},
    ],
    "accompagnements": [
        {"name": "Frites Pommes de terre", "price": "2 000", "img": "frites.jpg"},
        {"name": "Alloco", "price": "1 000", "img": "alloco_1.jpg"},
        {"name": "Igname Bouillie", "price": "1 000", "img": "igname_bouillie.jpg"},
        {"name": "Attiéké ou Riz", "price": "500", "img": "attiéké.jpg"},
    ],
    "accompagnementsExtra": [
        {"name": "Igname Frite", "price": "1 500"},
        {"name": "Sauce Graine", "price": "1 000"},
        {"name": "Sauce Arachide", "price": "1 000"},
        {"name": "Sauce Gnangnan", "price": "1 000"},
        {"name": "Sauce Aubergine", "price": "1 000"},
    ],
    "spiritueux": [
        {"name": "Champagne", "price": "25 000"},
        {"name": "Martini", "price": "13 000"},
        {"name": "Campari", "price": "10 000"},
        {"name": "Vin mousseux", "price": "7 000"},
    ],
    "vins": [
        {"name": "Vin Bordeaux", "price": "3 000 - 8 000"},
        {"name": "Vin Valpierre", "price": "2 500"},
    ],
    "bieres": [
        {"name": "Beaufort", "price": "800"},
        {"name": "Téquila", "price": "700"},
        {"name": "Bock 66", "price": "700"},
        {"name": "Despérado", "price": "700"},
        {"name": "Racine", "price": "700"},
        {"name": "Dopel", "price": "700"},
        {"name": "Heineken", "price": "700"},
    ],
    "cafes": [
        {"name": "Café", "price": "1 000"},
        {"name": "Expresso", "price": "1 000"},
        {"name": "Orangina", "price": "1 000"},
        {"name": "Cody's", "price": "1 000"},
        {"name": "Sanbitter", "price": "1 000"},
        {"name": "Sucreries (Fanta, Coca...)", "price": "800"},
        {"name": "Rhino", "price": "700"},
    ],
}


def build_cover():
    page = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(page)

    # Logo
    logo = load_img(os.path.join(IMG_DIR, "logo.png"), 200, 200)
    if logo:
        lx = (W - logo.width) // 2
        page.paste(logo, (lx, 200), logo if logo.mode == "RGBA" else None)

    # Gold border on logo
    if logo:
        draw.ellipse([(lx - 4, 196), (lx + logo.width + 4, 200 + logo.height + 4)], outline=GOLD, width=3)

    # Title
    tf = get_georgia(72, bold=True)
    center_text(draw, "Espace Beach Ahoué", 460, tf, GOLD)

    # Line
    draw.rectangle([(W // 2 - 80), 540, (W // 2 + 80), 544], fill=GOLD)

    # Subtitle
    sf = get_georgia(56, bold=True)
    center_text(draw, "Carte du Menu", 570, sf, TEXT)

    # Tag
    tagf = get_font(26)
    center_text(draw, "RESTAURANT & BAR", 650, tagf, MUTED)

    # Border box
    rounded_rect(draw, (W // 2 - 160, 710, W // 2 + 160, 756), 6, outline=GOLD, width=2)
    bf = get_font(22, bold=True)
    center_text(draw, "CUISINE IVOIRIENNE MODERNE", 718, bf, GOLD)

    # Contact
    cf = get_font(18)
    center_text(draw, "Route d'Alépé, Ahoué  |  +225 27 33 76 43 59", 820, cf, MUTED)
    sf2 = get_font(16)
    center_text(draw, "ahouebeach.net", 860, sf2, (150, 150, 150))

    return page


def build_food():
    page = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(page)
    d = MENU
    y = 40
    lm = 50
    page_w = W - 100
    card_w = (page_w - 30) // 2
    card_h = 220

    # Spécialités
    y = section_title(draw, "Nos Spécialités", y)
    for i, item in enumerate(d["specialites"]):
        col = i % 2
        ix = lm + col * (card_w + 30)
        draw_card(page, draw, os.path.join(MENU_DIR, item["img"]),
                  item["name"], item["price"], item.get("desc", ""),
                  ix, y, card_w, card_h)
    y += card_h + 20

    # Poissons & Crustacés
    y = section_title(draw, "Nos Poissons & Crustacés", y)
    y = sub_title(draw, "Poissons", y)
    for i, item in enumerate(d["poissons"]):
        col = i % 2
        ix = lm + col * (card_w + 30)
        draw_card(page, draw, os.path.join(MENU_DIR, item["img"]),
                  item["name"], item["price"], item.get("desc", ""),
                  ix, y, card_w, card_h)
    y += card_h + 10
    y = draw_box(draw, "Suite Poissons", d["poissonsExtra"], lm, y, page_w)

    y = sub_title(draw, "Les Crustacés", y)
    for i, item in enumerate(d["crustaces"]):
        col = i % 2
        ix = lm + col * (card_w + 30)
        draw_card(page, draw, os.path.join(MENU_DIR, item["img"]),
                  item["name"], item["price"], item.get("desc", ""),
                  ix, y, card_w, card_h)
    y += card_h + 10
    y = draw_box(draw, "Suite des Crustacés", d["crustacesExtra"], lm, y, page_w)

    # Viandes & Volailles
    y = section_title(draw, "Nos Viandes & Volailles", y)
    if y > H - 300:
        page2 = Image.new("RGB", (W, H), BG)
        draw = ImageDraw.Draw(page2)
        y = 40

    y = sub_title(draw, "Les Viandes", y)
    for i, item in enumerate(d["viandes"]):
        col = i % 2
        ix = lm + col * (card_w + 30)
        draw_card(page, draw, os.path.join(MENU_DIR, item["img"]),
                  item["name"], item["price"], item.get("desc", ""),
                  ix, y, card_w, card_h)
    y += card_h + 10
    y = draw_box(draw, "Suites Viandes", d["viandesExtra"], lm, y, page_w)

    y = sub_title(draw, "Les Volailles", y)
    for i, item in enumerate(d["volailles"]):
        col = i % 2
        ix = lm + col * (card_w + 30)
        draw_card(page, draw, os.path.join(MENU_DIR, item["img"]),
                  item["name"], item["price"], item.get("desc", ""),
                  ix, y, card_w, card_h)
    y += card_h + 10
    y = draw_box(draw, "Suite Volailles", d["volaillesExtra"], lm, y, page_w)

    # Accompagnements
    y = section_title(draw, "Nos Accompagnements", y)
    acc_w = (page_w - 60) // 4
    acc_h = 180
    for i, item in enumerate(d["accompagnements"]):
        ix = lm + i * (acc_w + 20)
        draw_card(page, draw, os.path.join(MENU_DIR, item["img"]),
                  item["name"], item["price"], "",
                  ix, y, acc_w, acc_h)
    y += acc_h + 10
    y = draw_box(draw, "Extras", d["accompagnementsExtra"], lm, y, page_w)

    return page


def build_drinks():
    page = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(page)
    d = MENU
    y = 40
    lm = 50
    page_w = W - 100

    y = section_title(draw, "Les Boissons", y)

    for section_title_text, items, banner_file in [
        ("Spiritueux", d["spiritueux"], "spiritueux.jpg"),
        ("Vins", d["vins"], "vins.jpg"),
        ("Bières", d["bieres"], "bieres.jpg"),
        ("Cafés & Sucreries", d["cafes"], "sucreries.jpg"),
    ]:
        line_h = 30
        box_h = len(items) * line_h + 60

        rounded_rect(draw, (lm, y, lm + page_w, y + box_h), 10, fill=ALT)
        rounded_rect(draw, (lm, y, lm + page_w, y + box_h), 10, outline=(212, 175, 55, 50), width=2)

        stf = get_georgia(26, bold=True)
        stbbox = draw.textbbox((0, 0), section_title_text, font=stf)
        stw = stbbox[2] - stbbox[0]
        draw.text(((W - stw) // 2, y + 8), section_title_text, font=stf, fill=GOLD)

        iy = y + 40
        # Banner
        banner_path = os.path.join(MENU_DIR, banner_file)
        banner_im = load_img(banner_path, page_w - 20, 80)
        if banner_im:
            bx = lm + (page_w - banner_im.width) // 2
            page.paste(banner_im, (bx, iy), banner_im if banner_im.mode == "RGBA" else None)
            iy += banner_im.height + 8

        for item in items:
            iy = draw_list_item(draw, item["name"], item["price"], lm + 14, iy, page_w - 28)

        y += box_h + 16

    # Footer
    y += 10
    rounded_rect(draw, (lm, y, lm + page_w, y + 50), 8, outline=(255, 215, 0, 50), width=2)
    ftf = get_georgia(22, bold=True)
    center_text(draw, "Pour commander ou réserver", y + 6, ftf, GOLD)
    ff = get_font(18)
    center_text(draw, "WhatsApp : +225 07 94 10 94", y + 30, ff, MUTED)

    return page


def main():
    print("Generating PDF...")
    pages = [build_cover(), build_food(), build_drinks()]

    # Save as multi-page PDF
    pages[0].save(
        OUT, "PDF", resolution=150.0, save_all=True,
        append_images=pages[1:]
    )
    size_kb = os.path.getsize(OUT) / 1024
    print(f"PDF generated: {OUT} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()


