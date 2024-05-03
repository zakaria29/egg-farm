# EGG FARM PROJECT
This project make for learning about how to create a express project using TypeScript. It contains about CRUD, validate request, authentication, authorization, and simple transactions.

## Prepare Project
Create a new folder and name it your project
```bash
mkdir egg-farm
```

Enter to your project directory
```bash
cd egg-farm
```

Initialize your project with npm
```bash
npm init --y
```

Install your development dependencies
```bash
npm install --save-dev @types/express @types/node @types/multer @types/md5 @types/jsonwebtoken @types/joi @types/cors typescript ts-node prisma @prisma/client
```

Install your project dependencies
```bash
npm install nodemon cors express joi jsonwebtoken md5 multer
```

Initalize typescript in your project
```bash
npx tsc --init
```

In **tsconfig.json** file, uncomment and change this line like this
```json
"rootDir": "./src", /* Specify the root folder within your source files. */
"outDir": "./dist", /* Specify an output folder for all emitted files. */
```
Then create a folder "dist" and "src" in root folder of project


Initialize your Prisma ORM with this command
```bash
npx prisma init --datasource-provider mysql
```

Create new database and set name of your database in .env file (for the example database name is "egg")
```env
DATABASE_URL="mysql://root@localhost:3306/egg"
```
Add new line to set secret key of JWT Token in **.env** file
```bash
JWT_SECRET_KEY="SOLIIIIID"
```

Set your schema's model in **prisma/schema.prisma** and then migrate your schema with this command
```bash
npx prisma migrate dev
```

## Upload File Feature
1. Create folder **public** in root folder.
2. Create folder **egg-image** inside **public** folder. This folder use to store uploaded file.
3. Make a new file **"global.ts"** inside **src** folder to define BASE URL of your project.
```typescript
import path from "path";
/** define path (address) of root folder */
export const BASE_URL = `${path.join(__dirname, "../")}`
```
4. Make a new file **"uploadImageOfEgg.ts"** inside **src/middleware** (make a folder middleware if doesn't exist yet).
5. Add this code in **uploadImageOfEgg.ts** to config upload file.
```typescript
import { Request } from "express";
import multer from "multer";
import { BASE_URL } from "../global";

/** define storage configuration of egg's image  */
const storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        /** define location of uploaded image, make sure that you have create a "public" folder in root folder.
         * then create folder "egg-image" inside of "public folder"
         */
        cb(null, `${BASE_URL}/public/egg-image/`)
    },
    filename: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        /** define file name of uploaded file */
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
    }
})

const uploadFile = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } /** define max size of uploaded file, in this case max size is 2 MB */
})

export default uploadFile
```
6. Then you can look at **eggController.ts** in **src/controllers** for a complete code of upload file.
7. Call upload file as a middleware function in route of egg. Look at **eggRoute.ts** for a complete code.
