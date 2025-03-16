# Auto Changelog PR

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/brustolin/auto-changelog-pr)

**Auto Changelog PR** is a GitHub Action that automatically updates a **CHANGELOG** file by replacing a `<#PR>` placeholder with the **Pull Request (PR) number**.

This helps automate changelog updates during merges, ensuring consistency without manual intervention. 🚀

---

## Features
- ✅ **Replaces `<#PR>` with the current PR number**  
- ✅ **Detects if the PR number is already present** to avoid unnecessary changes  
- ✅ **Fails the action (optional) if no placeholder is found**  
- ✅ **Supports any changelog file name** (default: `CHANGELOG.md`)  

---

## 📌 Usage

### **1️⃣ Add This Action to Your Workflow**
Create (or update) `.github/workflows/update-changelog.yml` in your repository:

```yaml
name: Update Changelog

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  update-changelog:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run Auto Changelog PR
        uses: your-username/auto-changelog-pr@v1
        with:
          changelog-file: "CHANGELOG.md"
          fail-on-needs-update: "true"
          auto-commit: "true"
```

---

## ⚙️ Inputs
| Name               | Description                                                       | Required | Default         |
|--------------------|-------------------------------------------------------------------|----------|-----------------|
| `changelog-file`  | The path to the changelog file. | ✅ Yes | `CHANGELOG.md`  |
| `fail-on-needs-update` | If "true", the action **fails** if `<#PR>` is not found. | ✅ Yes | "true" |
| `auto-commit` | Automatically commit the changes back to the branch | ✅ Yes | "true" |

---

## 📤 Outputs
| Name         | Description                                      |
|-------------|--------------------------------------------------|
| `did-update` | Returns `true` if `<#PR>` was replaced, otherwise `false`. |

---

## 🔍 Behavior

| Condition                                   | Result         |
|--------------------------------------------|---------------|
| `<#PR>` placeholder exists                | ✅ **Replaced** with PR number (`#123`) |
| PR number (`#123`) is **already present** | ✅ **No update** needed |
| No `<#PR>` and PR number is missing       | ⚠️ **Fails if `fail-on-needs-update: true`** |

---

## 📌 Example Scenarios

### ✅ **Case 1: Placeholder Exists**
**Before (`CHANGELOG.md`)**:
```
## [1.2.3] - 2025-03-16
- Added new feature XYZ (#456)
- Fixed issue with login (<#PR>)
```
**After (`CHANGELOG.md`)**:
```
## [1.2.3] - 2025-03-16
- Added new feature XYZ (#456)
- Fixed issue with login (#123)
```
➡️ **Output: `did-update = true`**  

---

### ✅ **Case 2: PR Number Already Exists**
**Before (`CHANGELOG.md`)**:
```
## [1.2.3] - 2025-03-16
- Added new feature XYZ (#456)
- Fixed issue with login (#123)
```
➡️ **No changes needed**  
➡️ **Output: `did-update = false`**  

---

### ⚠️ **Case 3: No Placeholder or PR Number Found**
**Before (`CHANGELOG.md`)**:
```
## [1.2.3] - 2025-03-16
- Added new feature XYZ (#456)
- Fixed issue with login
```
➡️ **Fails the action if `fail-on-needs-update: "true"`**  
➡️ **Output: `did-update = false`**  

---

## 💡 How It Works
1. Extracts the **Pull Request Number** using the GitHub Actions Toolkit.
2. Reads the **changelog file** specified in `changelog-file`.
3. Checks for:
   - `<#PR>` → **Replaces with PR number (`#123`)**.
   - `#123` already exists → **No update**.
   - Neither exist → **Fails if `fail-on-needs-update` is `true`**.
4. Saves the updated file.

---

## 🚀 Development & Contributions
### 🛠 Running Locally
1. Clone the repo:
   ```sh
   git clone https://github.com/your-username/auto-changelog-pr.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run manually:
   ```sh
   node index.js CHANGELOG.md 123
   ```
   
### 💡 Contributing
- Found a bug? Open an [issue](https://github.com/your-username/auto-changelog-pr/issues).
- Want to improve it? Submit a **Pull Request**.

---

## 📜 License
This project is licensed under the **MIT License**.

---

🎉 **Happy Coding!** 🚀

