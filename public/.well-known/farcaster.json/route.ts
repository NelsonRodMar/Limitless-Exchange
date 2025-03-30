export async function GET() {
    const appUrl = process.env.NEXT_PUBLIC_FRAME_URL;
  
    const config = {
      accountAssociation: {
        header:
          "eyJmaWQiOjYwODMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgxY0EzOTViMzdiNUNGM0FEZDQwMDVBNkU4OWIxMzEzNDJiRWI3ZEMzIn0",
        payload: "eyJkb21haW4iOiJuZWxzb24tbGltaXRsZXNzLnZlcmNlbC5hcHAifQ",
        signature:
          "MHhiZDE5MWYwZGM1ZjVkY2Y2MzczZjUxOTZjMTNlYjc4NDk0NDQ0MWE4MDkwODViZTI1NzE1NGIzODhiY2Y1Y2IzNDc1YjQxY2U2ZTIxZjdiNTNmZjRkNDlmMmVmZTI2M2ExOWUzMDdmM2FjMzM2ZTQ5ZDFkMWY4NjM0NjM4YTY1MTFi",
      },
      frame: {
        version: "1",
        name: "Limitless (unofficial)",
        iconUrl: `${appUrl}/assets/images/logo.png`,
        homeUrl: `${appUrl}`,
        imageUrl: `${appUrl}/farcaster-frame.png`,
        buttonTitle: "Yoink with an embedded wallet!",
        splashImageUrl: `${appUrl}/assets/images/logo.png`,
        splashBackgroundColor: "#000000",
        webhookUrl: `${appUrl}/api/webhook`
      },
    };
  
    return Response.json(config);
  }