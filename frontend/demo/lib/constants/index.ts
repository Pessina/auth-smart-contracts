export const mockTransaction = (nonce: number) => ({
  receiver_id: "felipe-sandbox-account.testnet",
  nonce: nonce.toString(),
  actions: [
    { Transfer: { deposit: "10000000000000000000" } },
    // {
    //   FunctionCall: {
    //     method_name: "sign",
    //     args: JSON.stringify({
    //       request: {
    //         path: "ethereum,1",
    //         payload: Array(32).fill(0).map((_, i) => i % 10),
    //         key_version: 0
    //       }
    //     }),
    //     gas: "50000000000000",
    //     deposit: "250000000000000000000000"
    //   }
    // }
  ],
});

export const FACEBOOK_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImIzNjQwYjliODY2YTdlM2EzNjc2MThjYWY0OWJlMjBjODVjMDA2NDcifQ.eyJpc3MiOiJodHRwczpcL1wvd3d3LmZhY2Vib29rLmNvbSIsImF1ZCI6IjIxMDM0OTYyMjAwNDU4NDMiLCJzdWIiOiI5MDAxMTQ1NzQzMjcwMjgwIiwiaWF0IjoxNzMxNTc4NzI3LCJleHAiOjE3MzE1ODIzMjcsImp0aSI6ImZmSVYuMDdkYWVlZmEzOWNjMzc1ZDYyZWE3NzU4NzE1OWNlYWY4NDA4NTk3NjEwNzlkY2M0MzRiMGZmNjI1MjFmNjkwMSIsIm5vbmNlIjoidGVzdC0xMjMiLCJhdF9oYXNoIjoiWjFKTVBnWkhFVnZYbkxuaERITm9EdyIsImVtYWlsIjoiZnMucGVzc2luYVx1MDA0MGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJGZWxpcGUiLCJmYW1pbHlfbmFtZSI6IlBlc3NpbmEiLCJuYW1lIjoiRmVsaXBlIFBlc3NpbmEiLCJwaWN0dXJlIjoiaHR0cHM6XC9cL3BsYXRmb3JtLWxvb2thc2lkZS5mYnNieC5jb21cL3BsYXRmb3JtXC9wcm9maWxlcGljXC8_YXNpZD05MDAxMTQ1NzQzMjcwMjgwJmhlaWdodD0xMDAmd2lkdGg9MTAwJmV4dD0xNzM0MTcwNzI4Jmhhc2g9QWJabVBSYW9QQ21FQll4NU1sRkxfTjBEIn0.LqX_xPyGTZQptJ4ipax-TQqD4wDSYw_tDv8fnFRdegXWXfCSXHwdsP4mScRnqEit0jzvOqySbTjaKLw5szqVWlpo4qVgZDDXeI4WEBcxAxTy6kvhPxa86BXhpGThc85mmHv8ULPoB3ur4evxzHEqn_icE4s4USvhVfl8SzkEWeBSOoGVRwqDA7Cq0isjMBWCzXG6zFYHwSg12itrh-eV1zKxwKTSNdDzScCPiunfbpjc50PPL6bsZuIlzI99Bhxmd7NImMvqxVVJdXC7jEE3Tb6J3XyxppSOy1GBofbLb6UkeMVW72uefg_rpVxQesvkMi5SlVW9AHIlZ7W_8oXjpA";
export const GOOGLE_TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFkYzBmMTcyZThkNmVmMzgyZDZkM2EyMzFmNmMxOTdkZDY4Y2U1ZWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NzY4MzQxNzQyODItNmNlOTlkcGhuYjVsczk0NWI3ODNrZmprcjV1aDdlMDMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NzY4MzQxNzQyODItNmNlOTlkcGhuYjVsczk0NWI3ODNrZmprcjV1aDdlMDMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5MDI4NTUzNzMxNTc0MTAzMzAiLCJlbWFpbCI6ImZzLnBlc3NpbmFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTczMTU4NDE1NCwibmFtZSI6IkZlbGlwZSBQZXNzaW5hIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pLSmJVeUJWcUNCdjRxVkdPRFNuVlRnTEhQS04wdFZPTUlNWFZpdWtncmQtMHRmZWRVPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkZlbGlwZSIsImZhbWlseV9uYW1lIjoiUGVzc2luYSIsImlhdCI6MTczMTU4NDQ1NCwiZXhwIjoxNzMxNTg4MDU0LCJqdGkiOiJhM2I0YzIyNjljZmJkMDA2ZjBlNDQ5YmRkMzMwMDEwOWQ2N2I3YWZiIn0.QVtXndWLq0ZXfkuGaOQnOofzs-QyI6eqkWNkAs4aML7WIqWyts5X4rE-c7W0ORX5WAVk-W3eHyi870mHlxSfxuYomV_kcCMScT7ta8Y5bOFenbgSF1_Oh-Afw5g74EPkNjVY3wU_CE_HYJk8ROEfq1HhZHN57MZ5lyVH7P2F74t_6XugSnXmn5xznxmyYNagOa26sz3WS1h78nVuejTkcV0PKyz2D5ERiHZbsgLyjjTIkRfLXbj5ZRk3NFL3Hi3IDJ5t_EcmjsMlAr24I3q-uGex0EnJqFgdctdNbffwoDcEyAE8idolZxa_AK3Z4adwOnUxD9T5TlVDejd7yBcfdA";
