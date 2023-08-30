import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter()
  return ( 
  <>
  <p>guild.id: {router.query.slug?.[0]} </p>
  <p>channel.id: {router.query.slug?.[1]}</p>
  <p>messages: Array{"<Message>"}</p>
  </>
  )
}