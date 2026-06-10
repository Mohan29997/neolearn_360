import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => mockAxiosInstance),
      post: vi.fn(),
    },
  };
});

const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  defaults: { headers: { common: {} } },
};

vi.mock('../../storagemanager', () => ({
  StorageManager: {
    getAccessToken: vi.fn().mockResolvedValue('test-token'),
    getRefreshToken: vi.fn().mockResolvedValue('refresh-token'),
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    appLogout: vi.fn(),
  },
}));

vi.mock('../../helper/snackMessage', () => ({
  SnackNotification: vi.fn(),
}));

vi.mock('../../store', () => ({
  store: { dispatch: vi.fn() },
}));

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

describe('service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance.get.mockResolvedValue({ data: {} });
    mockAxiosInstance.post.mockResolvedValue({ data: {} });
    mockAxiosInstance.patch.mockResolvedValue({ data: {} });
    mockAxiosInstance.delete.mockResolvedValue({ data: {} });
  });

  it('userlogin calls POST /auth/login', async () => {
    const { service } = await import('../../service/index');
    await service.userlogin({ email: 'a@b.com', password: '123' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: '123' });
  });

  it('getDepartments calls GET /departments', async () => {
    const { service } = await import('../../service/index');
    await service.getDepartments();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/departments', expect.objectContaining({ params: expect.any(Object) }));
  });

  it('getuserprofile calls GET /users/profile', async () => {
    const { service } = await import('../../service/index');
    await service.getuserprofile();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile');
  });

  it('onboardUser calls POST /users/onboard', async () => {
    const { service } = await import('../../service/index');
    await service.onboardUser({ name: 'Alice' } as any);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/onboard', { name: 'Alice' });
  });

  it('getCities calls GET /users/city', async () => {
    const { service } = await import('../../service/index');
    await service.getCities();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/city');
  });

  it('getRoles calls GET /users/roles', async () => {
    const { service } = await import('../../service/index');
    await service.getRoles();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/roles');
  });

  it('updateAdminUser calls PATCH /users/admins/:id', async () => {
    const { service } = await import('../../service/index');
    await service.updateAdminUser('123', { name: 'Bob' });
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/admins/123', { name: 'Bob' });
  });

  it('getUsers calls GET /users', async () => {
    const { service } = await import('../../service/index');
    await service.getUsers({ page: 1, limit: 10 });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', expect.any(Object));
  });

  it('createDepartment calls POST /departments', async () => {
    const { service } = await import('../../service/index');
    await service.createDepartment({ departlist: [{ name: 'Eng', manager_name: 'M', employee_id: 'E1' }] });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/departments', expect.any(Object));
  });

  it('updateDepartment calls PATCH /departments/:id', async () => {
    const { service } = await import('../../service/index');
    await service.updateDepartment('d1', { name: 'HR', manager_name: 'M', employee_id: 'E1', isActive: true });
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/departments/d1', expect.any(Object));
  });

  it('getAdminUsers calls GET /users/admins', async () => {
    const { service } = await import('../../service/index');
    await service.getAdminUsers({});
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/admins', expect.any(Object));
  });

  it('getBenchUsers calls GET /users', async () => {
    const { service } = await import('../../service/index');
    await service.getBenchUsers();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', expect.any(Object));
  });

  it('updateUserStatus calls PATCH /users/:id/status', async () => {
    const { service } = await import('../../service/index');
    await service.updateUserStatus('u1', 'active');
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/u1/status', { status: 'active' });
  });

  it('getManagerUsers calls GET /users', async () => {
    const { service } = await import('../../service/index');
    await service.getManagerUsers();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', expect.any(Object));
  });

  it('getCourses calls GET /courses', async () => {
    const { service } = await import('../../service/index');
    await service.getCourses(1, 10);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/courses?page=1&limit=10');
  });

  it('deleteCourse calls DELETE /courses/:id', async () => {
    const { service } = await import('../../service/index');
    await service.deleteCourse('c1');
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/courses/c1');
  });

  it('addCourse calls POST /courses', async () => {
    const { service } = await import('../../service/index');
    await service.addCourse({ title: 'React' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/courses', { title: 'React' });
  });

  it('assignCourse calls POST /courses/assign', async () => {
    const { service } = await import('../../service/index');
    await service.assignCourse({ course_id: 'c1', mentor_id: 'm1', user_id: 'u1' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/courses/assign', expect.any(Object));
  });

  it('updateAssignedCourse calls PATCH /courses/assign', async () => {
    const { service } = await import('../../service/index');
    await service.updateAssignedCourse({ user_id: 'u1', course_id: 'c1', coordinator_id: 'co1' });
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/courses/assign', expect.any(Object));
  });

  it('getAssignedCourses calls GET /courses/assign', async () => {
    const { service } = await import('../../service/index');
    await service.getAssignedCourses({ page: 1 });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/courses/assign', expect.any(Object));
  });

  it('getLearningJourneys calls GET /learning-journeys', async () => {
    const { service } = await import('../../service/index');
    await service.getLearningJourneys();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/learning-journeys', expect.any(Object));
  });
});
