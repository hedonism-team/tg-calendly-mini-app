import { useEffect } from 'react'
import { LinkModel } from '@/lib/models/Link.model'
import { UserModel } from '@/lib/models/User.model'

export function useEnsureLink(
  linkId: string,
  setData: (data: { link: LinkModel | null; owner: UserModel | null }) => void
) {
  useEffect(() => {
    const getLink = async (linkId: string) => {
      const response = await fetch(`/api/links?id=${linkId}`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('Failed to get link')
      }
      return response.json()
    }
    getLink(linkId)
      .then((data) => {
        setData(data)
      })
      .catch((e) => {
        setData({ link: null, owner: null })
      })
  }, [linkId, setData])
}
