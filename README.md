## Quick Start
```bash
git clone https://github.com/AmmaarKhan03/gdgc_hackathon.git
cd gdgc_hackathon

# env files
cp server/.env.example server/.env
cp client/.env.example client/.env
# fill MONGODB_URI and JWT_SECRET in server/.env

npm install
npm run dev
# Client: http://localhost:5173  |  API health: http://localhost:4000/api/health
