export async function POST(request) {
  try {
    const { style, weather } = await request.json()

    // 실제 핀터레스트 API 연동 시 사용할 코드
    // const PINTEREST_ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN
    // const response = await fetch('https://api.pinterest.com/v5/pins/search', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
    //     'Content-Type': 'application/json'
    //   },
    //   params: {
    //     query: `${style} fashion ${weather} outfit`,
    //     limit: 20
    //   }
    // })

    // 현재는 모의 응답 반환
    const mockPinterestResponse = {
      data: [
        {
          id: "pinterest_1",
          title: `${style} fashion inspiration`,
          description: `Perfect ${style} outfit for ${weather} weather`,
          image: {
            original: {
              url: `/placeholder.svg?height=400&width=300&query=${style} fashion ${weather}`,
            },
          },
          board: {
            name: "Fashion Inspiration",
          },
          creator: {
            username: "fashionista",
          },
        },
      ],
    }

    return Response.json(mockPinterestResponse)
  } catch (error) {
    console.error("Pinterest API error:", error)
    return Response.json({ error: "Failed to fetch Pinterest data" }, { status: 500 })
  }
}
