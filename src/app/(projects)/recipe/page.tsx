import { NextPage } from "next";
import Link from "next/link";
const Page: NextPage = async () => {
    // return <h1>I am too lazy to finish this</h1>

    return (
        <>
        <div>
            <Link href="/recipe/create">Create recipe</Link>
        </div>
        </>
    )
}
export default Page;