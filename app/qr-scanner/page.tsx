import ScannerQr from "@/components/qr.scanner";

export default function ScannerQrPage() {

  return<> 
    <section className=" w-[80%] md:w-[85%] h-[86vh] ml-[10%] md:ml-[8%] mt-[30px]  flex justify-around flex-wrap overflow-y-scroll m-2 p-2 items-center">

      <ScannerQr />

    </section>

    </>
}
  