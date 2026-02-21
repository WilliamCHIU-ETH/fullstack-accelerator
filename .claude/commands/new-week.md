Create the scaffolding for week-$ARGUMENTS.

Follow these steps:
1. Create these directories:
   - `week-$ARGUMENTS/my-work/`
   - `week-$ARGUMENTS/tests/`
   - `week-$ARGUMENTS/complete/`

2. Create `week-$ARGUMENTS/package.json`:
   ```json
   {
     "name": "week-$ARGUMENTS",
     "type": "module",
     "private": true,
     "scripts": {
       "test": "node --test tests/"
     }
   }
   ```

3. Create `week-$ARGUMENTS/CLAUDE.md` with a template:
   ```markdown
   # Week $ARGUMENTS：[title TBD]

   ## 本週情境
   [To be filled]

   ## 特殊規則
   - 回應盡量簡短，一次不超過 20 行 code
   - 每次產生 code 後，用一句話解釋「這段在做什麼」
   ```

4. Create `week-$ARGUMENTS/README.md` with a progress checklist template

5. Create `week-$ARGUMENTS/DECISIONS.md` with decision log template

6. Run `npm install` at the repo root to register the new workspace

7. Show the created structure to confirm
