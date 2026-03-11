from PIL import Image, ImageOps
import os

input_path = r"c:\Users\Saidmuhammadalixon\Desktop\aka_fs_sayt\public\favicon.png"
output_dir = r"c:\Users\Saidmuhammadalixon\Desktop\aka_fs_sayt\public"

def process_favicon():
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return

    img = Image.open(input_path).convert("RGBA")
    
    # Calculate more aggressive bounding box (ignore very dark pixels)
    # This helps if there's a faint glow that shouldn't dictate the crop
    temp_img = img.convert("L")
    # Threshold to ignore very dark pixels (e.g. background black circle)
    # 30 is a safe threshold to keep the green glow but remove deep black
    thresh = temp_img.point(lambda p: p > 30 and 255)
    bbox = thresh.getbbox()
    
    if bbox:
        img = img.crop(bbox)
    
    # Minimize padding when making square
    w, h = img.size
    size = max(w, h)
    square_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    # Standard paste puts it in the middle. 
    # Let's ensure it's centered but fills as much as possible.
    square_img.paste(img, ((size - w) // 2, (size - h) // 2))
    
    # Save standard sizes with high quality resampling
    # 32x32 for tab - we can actually "overfill" slightly if it helps visibility
    square_img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(output_dir, "favicon-32x32.png"))
    # 180x180 for Apple devices
    square_img.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(output_dir, "apple-touch-icon.png"))
    # 512x512 for Android/PWA
    square_img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(output_dir, "icon-512.png"))
    # Replace original with a high-res cleaned version
    square_img.resize((512, 512), Image.Resampling.LANCZOS).save(input_path)
    
    print("Favicon processing complete.")

if __name__ == "__main__":
    process_favicon()
