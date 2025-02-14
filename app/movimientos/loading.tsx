import LoadingComponent from "@/components/loading"
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return <section className="w-[100%] h-[95vh] flex justify-center items-center">

        <LoadingComponent />
    </section>
  }