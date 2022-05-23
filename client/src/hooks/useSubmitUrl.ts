import { useQueryClient, useMutation } from "react-query";
import axios from "axios";

export const useUpdateTitle = (obj: Record<string, any>, url: string) => {
  const queryClient = useQueryClient();

  return useMutation((obj) => axios.post(url, obj), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (response) => {
      // ✅ update detail view directly
      queryClient.setQueryData(["sendShorts", obj.id], response);
    },
  });
};
