import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage
import { LoginUserReq, LoginUserRes, UserRolesEnum } from '@/constants/type.d';

const API_BASE_URL = 'https://label.daidk.com/api/users'; // Update with your actual backend URL

class UserApi {
  // Login method
  async fakeLogin(_payload: LoginUserReq): Promise<LoginUserRes> {
    return {
      token: '12345',
      userId: 12345,
      userRole: UserRolesEnum.admin,
    };
  }

  async login(payload: LoginUserReq): Promise<LoginUserRes> {
    const response = await axios.post<LoginUserRes>(`${API_BASE_URL}/login`, payload);
    // You can store the token and user data after successful login
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userRole', response.data.userRole);
    await AsyncStorage.setItem('userId', String(response.data.userId));
    return response.data;
  }

  // Logout method
  async logout() {
    // Clear token and user data from AsyncStorage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userId');
  }

  // Example: Fetching user data with a token
  async getUser(userId: number) {
    const token = await AsyncStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_BASE_URL}/${userId}`, config);
    return response.data;
  }
}

const api = new UserApi();
export default api;
