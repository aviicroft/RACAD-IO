// Script to reactivate user account for aviicroft@gmail.com
const fetch = require('node-fetch');

async function reactivateUser() {
  try {
    // First, find the user by email
    const findResponse = await fetch('http://localhost:3000/api/admin/users?search=aviicroft@gmail.com', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'jwt=YOUR_JWT_TOKEN_HERE' // Replace with actual admin JWT token
      }
    });

    if (!findResponse.ok) {
      console.error('Failed to find user:', findResponse.status);
      return;
    }

    const userData = await findResponse.json();
    const user = userData.users.find(u => u.email === 'aviicroft@gmail.com');

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Found user:', user.username, user.email, 'Status:', user.isActive ? 'Active' : 'Inactive');

    if (user.isActive) {
      console.log('User is already active');
      return;
    }

    // Reactivate the user
    const updateResponse = await fetch(`http://localhost:3000/api/admin/users/${user._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'jwt=YOUR_JWT_TOKEN_HERE' // Replace with actual admin JWT token
      },
      body: JSON.stringify({ isActive: true })
    });

    if (updateResponse.ok) {
      console.log('✅ User account reactivated successfully!');
    } else {
      const error = await updateResponse.json();
      console.error('Failed to reactivate user:', error);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

reactivateUser();
