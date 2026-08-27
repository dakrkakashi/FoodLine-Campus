import os
import shutil

SOURCE_SKILLS_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\PPT OTHER TASKES\.agents\antigravity-skills\skills"
GLOBAL_SKILLS_DIR = r"C:\Users\Shivam Manoj Nirmal\.gemini\config\skills"
LOCAL_SKILLS_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\PPT OTHER TASKES\.agents\skills"

def install_skills():
    os.makedirs(GLOBAL_SKILLS_DIR, exist_ok=True)
    os.makedirs(LOCAL_SKILLS_DIR, exist_ok=True)

    skills = [d for d in os.listdir(SOURCE_SKILLS_DIR) if os.path.isdir(os.path.join(SOURCE_SKILLS_DIR, d))]
    print(f"Discovered {len(skills)} skills in antigravity-skills repository.")

    installed_count = 0
    for skill_name in skills:
        src = os.path.join(SOURCE_SKILLS_DIR, skill_name)
        
        # 1. Global install
        dst_global = os.path.join(GLOBAL_SKILLS_DIR, skill_name)
        if not os.path.exists(dst_global):
            shutil.copytree(src, dst_global, dirs_exist_ok=True)

        # 2. Local project install
        dst_local = os.path.join(LOCAL_SKILLS_DIR, skill_name)
        if not os.path.exists(dst_local):
            shutil.copytree(src, dst_local, dirs_exist_ok=True)
        
        installed_count += 1

    print(f"Successfully installed and registered all {installed_count} skills into Global and Project memory!")

if __name__ == "__main__":
    install_skills()
