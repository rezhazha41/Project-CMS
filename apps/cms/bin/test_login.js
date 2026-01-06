
const assert = await import('node:assert');

async function run() {
    const baseUrl = 'http://localhost:3333';
    const email = 'admin@school.com';
    const password = 'password';

    console.log('1. Attempting login...');
    const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        redirect: 'manual'
    });

    console.log('Login Status:', loginRes.status);

    const cookies = loginRes.headers.get('set-cookie');
    console.log('Cookies received:', cookies);

    if (!cookies) {
        console.error('FAILED: No cookies received after login.');
        return;
    }

    // Extract session cookie (simple extraction)
    const sessionCookie = cookies.split(';')[0];

    console.log('2. Accessing /admin with cookie...');
    const adminRes = await fetch(`${baseUrl}/admin`, {
        headers: { 'Cookie': sessionCookie },
        redirect: 'manual'
    });

    console.log('Admin Status:', adminRes.status);
    if (adminRes.status === 200) {
        console.log('SUCCESS: Accessed admin dashboard.');
    } else if (adminRes.status === 302) {
        console.log('FAILED: Redirected back to:', adminRes.headers.get('location'));
    } else {
        console.log('FAILED: Unexpected status code.');
    }
}

run().catch(console.error);
