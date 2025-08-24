# 🚀 College Chatbot Setup Guide

## 🔑 **Step 1: Get Your Perplexity API Key**

1. Go to [Perplexity AI](https://www.perplexity.ai/)
2. Sign up or log in to your account
3. Navigate to [Settings > API](https://www.perplexity.ai/settings/api)
4. Click "Generate API Key"
5. Copy your API key (it starts with `pplx-`)

## 📁 **Step 2: Create Environment File**

1. In your project root directory, create a file called `.env.local`
2. Add your API key to the file:

```bash
PERPLEXITY_API_KEY=pplx-your_actual_api_key_here
```

**Important:** Replace `pplx-your_actual_api_key_here` with your real API key from Step 1.

## 🔧 **Step 3: Restart Development Server**

1. Stop your current development server (Ctrl+C)
2. Run the server again:
```bash
npm run dev
```

## ✅ **Step 4: Test the Chatbot**

1. Open your browser to `http://localhost:3001` (or whatever port is shown)
2. Type a question like "What courses are available?"
3. The chatbot should now respond with information from your college content!

## 🐛 **Troubleshooting**

### **If you still get no response:**

1. **Check the browser console** (F12 → Console tab) for error messages
2. **Check the terminal** where you're running `npm run dev` for server errors
3. **Verify your API key** is correct and starts with `pplx-`
4. **Make sure the `.env.local` file** is in the project root (same folder as `package.json`)

### **Common Error Messages:**

- **"Missing PERPLEXITY_API_KEY"** → You need to create the `.env.local` file
- **"401 Unauthorized"** → Your API key is invalid or expired
- **"429 Rate Limited"** → You've exceeded your API quota, wait a bit
- **"500 Server Error"** → Check the server console for more details

### **File Structure Check:**

Your project should look like this:
```
college-chatbot/
├── .env.local          ← Create this file with your API key
├── package.json
├── app/
├── components/
└── ...
```

## 💡 **How It Works**

1. **User types a question** in the chat interface
2. **The app sends the question** to your local API (`/api/chat`)
3. **Your API finds relevant content** from `college_content.txt`
4. **Perplexity AI generates a response** based on that content
5. **The response streams back** to the user in real-time

## 🎯 **Next Steps**

Once it's working:
- Try different types of questions (admissions, fees, courses, etc.)
- Check out the chat history feature
- Customize the UI colors and styling
- Add more college content to `college_content.txt`

## 🆘 **Still Having Issues?**

1. Check that your `.env.local` file is in the right location
2. Verify your API key is correct
3. Restart the development server after adding the environment variable
4. Check the browser console and terminal for specific error messages

---

**Happy chatting! 🎉**

