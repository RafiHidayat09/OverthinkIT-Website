import { useJwt } from "react-jwt";
import { API } from "../_api";

export const login = async ({ email, password}) => {
    try {
      const { data } = await API.post('/login', { email, password})
      return data 
    } catch (error) {
      console.log(error);
      throw error
    }
}

export const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // Jika token tidak ada, langsung return success
    if (!token) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      return { success: true };
    }

    // Coba logout ke server
    const { data } = await API.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Hapus token setelah berhasil
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    
    return data;
  } catch (error) {
    console.log('Logout error:', error);
    
    // Meskipun API gagal (401/expired), tetap hapus token lokal
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    
    // Return success agar user tetap bisa logout dari frontend
    return { success: true, message: 'Logged out locally' };
  }
}

// export const logout = async ({token}) => {
//   try {
//     const { data } = await API.post('/logout', { token }, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//       }
//     })
//     localStorage.removeItem('accessToken')
//     return data
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

export const register = async ({ name, email, password, role = "user" }) => {
  try {
    const { data } = await API.post("/register", { name, email, password, role });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



export const useDecodeToken = (token) => {
  const { decodedToken, isExpired } = useJwt(token)
  try {
    if (isExpired) {
      return  {
        success: false,
        message: "Token Expired",
        data: null
      }
    }
    return {
      success: true,
      message: "Token Valid",
      data: decodedToken
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    }
  }
}

// Function untuk handle Google OAuth callback

export const redirectToGoogleAuth = () => {
  const backendGoogleUrl = "http://127.0.0.1:8000/auth/google";

  console.log('➡️ Redirecting to Laravel Backend:', backendGoogleUrl);
  
  window.location.href = backendGoogleUrl;
};

export const handleGoogleCallback = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Ambil data dari URL (dikirim oleh Laravel)
    const token = urlParams.get('token');
    const userParam = urlParams.get('user'); // Ini masih dalam bentuk Base64 string
    const error = urlParams.get('error');
    
    console.log('🔍 Reading URL Params from Laravel:', { 
      token: token ? '✓ Present' : '✗ Missing', 
      userParam: userParam ? '✓ Present' : '✗ Missing',
      error
    });

    // Cek Error dari Backend
    if (error) {
       return {
        success: false,
        error: decodeURIComponent(error)
      };
    }
    
    // Cek jika Token dan User ada
    if (token && userParam) {
      let userData;
      
      try {
        // Decode Base64 menjadi JSON Object
        // Laravel: base64_encode(json_encode($user)) -> JS: JSON.parse(atob(userParam))
        userData = JSON.parse(atob(userParam));
      } catch (e) {
        console.error('❌ Failed to decode user data', e);
        return { success: false, error: 'Invalid user data format' };
      }
      
      // Simpan token dan user info ke LocalStorage
      // Pastikan key ini konsisten dengan sistem login biasamu
      localStorage.setItem("accessToken", token); 
      localStorage.setItem("userInfo", JSON.stringify(userData));
      
      console.log('✅ Google login processed successfully:', userData);
      
      return {
        success: true,
        token,
        user: userData
      };
    } else {
      console.log('❌ Missing token or user data in URL');
      return {
        success: false,
        error: 'Authentication failed: No token received.'
      };
    }
  } catch (error) {
    console.error('💥 Error in handleGoogleCallback:', error);
    return {
      success: false,
      error: 'Failed to process Google login: ' + error.message
    };
  }
};


