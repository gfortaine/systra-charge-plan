How to configure Gitlab
=======================

## Mandatory Settings

### 1. Enable Repository, CI/CD, and Container Registry features

- Go to **Settings > General > Visibility, project features, permissions**
- Ensure the following toggles are **enabled**:
  - **Repository**
  - **CI/CD**
  - **Container registry**
- Click **Save changes**

### 2. Add a Deploy Key with write permissions

- Go to **Settings > Repository > Deploy keys**
- Click **Add new key**
- Generate a key pair locally:

```bash
ssh-keygen -t ed25519 -C "To push tags from gitlab CI" -f key
```

- In the **Title** field, enter a descriptive name (e.g., "CI tag push key")
- In the **Key** field, paste the contents of `key.pub`
- Check the **Grant write permissions to this key** checkbox
- Click **Add key**

### 3. Add the CI/CD Variable for the Deploy Key

- Go to **Settings > CI/CD > Variables**
- Click **Add variable**
- Configure as follows:
  - **Type:** File
  - **Visibility:** Visible
  - **Flags:** Leave **Protect variable** unchecked
  - **Key:** `DEPLOY_KEY_TO_TAG`
  - **Value:** Paste the contents of the private key file (`key`)
- Click **Add variable**

---

## Recommended Settings

### Merge Request Settings

Go to **Settings > Merge requests**:

- **Merge method** → Merge commit with semi-linear history
- **Merge options** → Check **Enable "Delete source branch" option by default**
- **Squash commits when merging** → Allow
- **Merge checks** → Check **Pipelines must succeed** and **All threads must be resolved**

Click **Save changes**.

### Protected Branches

Go to **Settings > Repository > Branch rules**:

- Master is protected branch. Either remove it, or allow developers to push and merge, and check Allow force push
