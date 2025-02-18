import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Peer from "@/images/peer.webp";
import CalComLogo from "@/images/cal-logo-light.svg";

export default function Testimonial() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-10 w-3/4 space-y-8 2xl:w-1/2">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Versatile in-app surveys. Valuable user insights.
          </h2>
        </div>
        {/*  <p className="text-slate-600">
          Make customer-centric decisions based on data.
          <br /> Keep 100% data ownership.
        </p> */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <CheckCircleIcon className="text-brand-dark h-6 w-6" />
            <p className="inline text-lg text-slate-900">All features included</p>
          </div>
          <div className="flex space-x-2">
            <CheckCircleIcon className="text-brand-dark h-6 w-6" />
            <p className="inline text-lg text-slate-900">Free and open-source</p>
          </div>
          <div className="flex space-x-2">
            <CheckCircleIcon className="text-brand-dark h-6 w-6" />
            <p className="inline text-lg text-slate-900">No credit card required</p>
          </div>
        </div>

        <div className="border-1 rounded-xl border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="italic text-slate-700">
            We measure the clarity of our docs and learn from churn all on one platform. Great product, very
            responsive team!
          </p>
          <div className="mt-4 flex items-center space-x-6">
            <Image
              src={Peer}
              alt="Cal.com Co-CEO Peer Richelsen"
              className="-mb-12 h-28 w-28 rounded-full border border-slate-200 shadow-sm"
            />
            <div>
              <p className="mb-1.5 text-sm text-slate-500">Peer Richelsen, Co-CEO Cal.com</p>
              <Image src={CalComLogo} alt="Cal.com Logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
