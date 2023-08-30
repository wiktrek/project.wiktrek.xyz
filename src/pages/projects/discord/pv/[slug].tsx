import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter()
  return ( 
  <>
  <p>user.id: {router.query.slug} </p>
  <p>messages: Array{"<Message>"}</p>
  </>
  )
}