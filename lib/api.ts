/**
 * API 호출 유틸리티 함수
 * 401 에러 시 자동으로 토큰 삭제 및 홈으로 리다이렉트
 */

export const handleApiResponse = async (
  response: Response,
  router?: any
): Promise<{ ok: boolean; data?: any; error?: string }> => {
  if (response.status === 401) {
    // 토큰이 유효하지 않으면 삭제하고 홈으로 리다이렉트
    localStorage.removeItem("jwt_token");
    if (router) {
      router.push("/");
    } else if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return { ok: false, error: "인증이 만료되었습니다" };
  }

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, error: data.error || "요청에 실패했습니다" };
  }

  return { ok: true, data };
};

/**
 * 인증이 필요한 API 호출 래퍼
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  router?: any
): Promise<Response> => {
  const token = localStorage.getItem("jwt_token");
  
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 에러 시 자동 처리
  if (response.status === 401) {
    localStorage.removeItem("jwt_token");
    if (router) {
      router.push("/");
    } else if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return response;
};

