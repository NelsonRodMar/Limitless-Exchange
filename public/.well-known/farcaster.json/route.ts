export async function GET() { 
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
        iconUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}/assets/images/logo.png`,
        homeUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}`,
        imageUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}/farcaster-frame.png`,
        buttonTitle: "Make your bet  on Limitless",
        splashImageUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}/assets/images/logo.png`,
        splashBackgroundColor: "#000000",
        webhookUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}/api/webhook`
      },
    };
  
    return Response.json(config);
  }