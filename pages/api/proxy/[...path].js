export default async function handler(req, res) {
  const { path } = req.query;
  let apiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Get base API URL from environment variables
  const API_BASE_URL = process.env.API_BASE_URL;
  
  // Ensure trailing slash for Django API compatibility
  if (apiPath && !apiPath.endsWith('/')) {
    apiPath += '/';
  }
  
  console.log(`Proxying request to: ${API_BASE_URL}/${apiPath}`);
  console.log(`Method: ${req.method}`);
  console.log(`Request body:`, req.body);
  console.log(`Headers:`, req.headers);
  
  try {
    // Clean headers - remove browser/Next.js specific headers
    const cleanHeaders = {
      'Accept': 'application/json',
      'User-Agent': 'NextJS-Proxy/1.0'
    };
    
    if (req.headers.authorization) {
      cleanHeaders.authorization = req.headers.authorization;
    }
    
    // Always set content type for POST/PUT requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      cleanHeaders['Content-Type'] = 'application/json';
    }
    
    // For Django APIs, we might need CSRF token
    if (req.headers['x-csrftoken']) {
      cleanHeaders['X-CSRFTOKEN'] = req.headers['x-csrftoken'];
    }
    
    const response = await fetch(`${API_BASE_URL}/${apiPath}`, {
      method: req.method,
      headers: cleanHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    console.log(`Response status: ${response.status}`);
    
    // Get the response text first to debug
    const responseText = await response.text();
    console.log(`Response text (first 300 chars):`, responseText.substring(0, 300));
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error(`Response body: ${responseText.substring(0, 500)}`);
      
      // If it's an HTML error page, extract useful info
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
        const errorTitle = titleMatch ? titleMatch[1] : `${response.status} ${response.statusText}`;
        return res.status(response.status).json({ 
          error: `External API Error: ${errorTitle}`,
          details: `The external API server returned an error page`,
          status: response.status,
          url: `${API_BASE_URL}/${apiPath}`
        });
      }
      
      // Try to parse JSON error if possible
      try {
        const errorData = JSON.parse(responseText);
        return res.status(response.status).json(errorData);
      } catch {
        return res.status(response.status).json({ 
          error: `API request failed: ${response.status} ${response.statusText}`,
          url: `${API_BASE_URL}/${apiPath}`,
          responseBody: responseText.substring(0, 500)
        });
      }
    }
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = JSON.parse(responseText);
        res.status(response.status).json(data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        res.status(500).json({ 
          error: 'Failed to parse JSON response',
          responseBody: responseText.substring(0, 500)
        });
      }
    } else {
      console.error('Non-JSON response received');
      res.status(500).json({ 
        error: 'API returned non-JSON response',
        contentType: contentType,
        responseBody: responseText.substring(0, 500)
      });
    }
  } catch (error) {
    console.error('API Proxy Error:', error.message);
    res.status(500).json({ 
      error: 'API request failed',
      details: error.message,
      url: `${API_BASE_URL}/${apiPath}`
    });
  }
}
