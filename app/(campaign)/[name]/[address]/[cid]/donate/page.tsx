"use client";
import ConnectButton from "@/app/components/ConnectButton";
import { H2 } from "@/app/components/util/Headers";
import { fetchBalance, fetchCampaign, handleDonate } from "@/app/utils/helper";
import Logo from "@/svgs/Logo";
import RightArrowIcon from "@/svgs/RightArrowIcon";
import SendIcon from "@/svgs/SendIcon";
import { useAccount } from "@starknet-react/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const Donate = ({
  params,
}: {
  params: { name: string; address: string; cid: string };
}) => {
  const router = useRouter();

  const [fontSize, setFontSize] = useState(2);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("STRK");
  const [sendingState, setSendingState] = useState<
    "send" | "sending..." | "sent"
  >("send");
  const { account, address } = useAccount();
  const [balance, setBalance] = useState("0");

  const [campaignDetails, setCampaignDetails] = useState({
    name: "",
    image: "/default-image.webp",
    description: "",
    date: "",
    organizer: "",
    beneficiary: "",
    location: "",
    target: "",
    address: "",
  });

  useEffect(() => {
    if (params.address && params.cid) {
      fetchCampaign(params.cid, null, null, setCampaignDetails, null);
    }
  }, []);

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchBalance(address, setBalance);
  }, [address]);

  const handleRouteToCampaign = () => {
    if (params.address && params.cid) {
      const campaignAddress = params.address;
      const campaignName = params.name;
      const cid = params.cid;
      router.push(`/${campaignName}/${campaignAddress}/${cid}`);
    }
  };

  const handleTokenSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setToken(event.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { scrollWidth, clientWidth, value } = event.target;
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setAmount(value);
    }

    if (value === "") {
      setFontSize(2);
    }
    if (scrollWidth > clientWidth) {
      setFontSize((prev) => Math.max(prev - 0.2, 0.8));
    }
  };
  const divRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="bg-background md:bg-theme-green w-screen min-h-screen   flex justify-between ">
      <div className="hidden w-[40%] md:flex flex-col p-4 items-center ">
        <button
          onClick={handleRouteToCampaign}
          className="w-fit text-[1.2em] self-start justify-self-start text-white flex items-center"
        >
          <span className="text-white inline-block transform rotate-180">
            <RightArrowIcon />
          </span>
          <span>campaign</span>
        </button>
        <div className="my-auto">
          <p className="font-bold text-white text-[1.5em]">
            <Logo />
          </p>

          <H2 style="text-theme-yellow">Every Token Counts!</H2>
          <div className="flex gap-2 items-center text-white">
            <p className=" mt-3 ">Empowering Change Through Generosity</p>
          </div>
        </div>
      </div>
      <div className="bg-background max-w-[500px] mx-auto md:max-w-none py-10 px-4 lg:py-10 lg:px-[5vw] w-full md:w-[60%]  md:rounded-tl-[50px] md:shadow-hero-shadow flex flex-col gap-10 md:gap-20 ">
        <div className="flex flex-wrap items-center justify-between md:justify-end">
          <button
            onClick={handleRouteToCampaign}
            className="block md:hidden w-fit text-[1em] md:text-[1.2em] self-start justify-self-start"
          >
            &lt; campaign
          </button>
          <ConnectButton />
        </div>
        <div className=" w-full lg:min-w-[35rem] lg:w-[75%] md:my-auto mx-auto px-4 lg:px-12 flex flex-col gap-4">
          <div className="md:hidden">
            <p className="font-bold text-[1.5em] text-theme-green flex items-center gap-1">
              <Logo />
            </p>
            <h2 className="text-theme-yellow">Every Token Counts!</h2>
          </div>
          <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-3 md:gap-4 ">
            <div className="hidden md:block w-[130px] h-[90px] rounded-[5px] relative">
              <Image
                className="w-full h-full rounded-[5px] object-cover"
                src={campaignDetails.image}
                alt=""
                fill
                sizes="100%"
              />
            </div>
            <div className="col-span-2 ">
              <p className=" text-clamp md:text-[1em]">
                You are supporting{" "}
                <span className="font-semibold"> {campaignDetails.name}</span>
              </p>
              <p className="mt-2 text-[.875em]">
                Your donation will benefit{" "}
                <span className="font-semibold">
                  {campaignDetails.beneficiary}
                </span>
              </p>
            </div>
          </div>
          <div className="w-fit mx-auto mt-8">
            <h5 className="font-medium">Send STRK</h5>
            <div className="h-[70px] w-[70px]  relative rounded-full mx-auto">
              <img
                className="rounded-full h-full w-full"
                src={`${token === "STRK" ? "/strk.webp" : "/eth.svg"}`}
                alt=""
              />
              <div className="right-[-10%] top-[60%] absolute bg-theme-green h-[30px] w-[30px] flex items-center justify-center rounded-full">
                <SendIcon />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium">Enter your donation</label>

            <div
              ref={divRef}
              className="relative w-full min-h-[5.5rem] bg-transparent border-solid border-[1px] rounded-[10px] px-5 border-gray-300 grid grid-cols-10 justify-between focus:border-[#159968] focus:border-[2px]"
            >
              <input
                onFocus={() => {
                  if (divRef.current && address) {
                    divRef.current.style.outline = "1px solid #159968";
                  }
                }}
                onBlur={() => {
                  if (divRef.current) {
                    divRef.current.style.outline = "none";
                  }
                }}
                disabled={!address}
                type="text"
                style={{
                  fontSize: `${fontSize}em`,
                }}
                name="amount"
                value={amount}
                className="col-span-8  w-full py-5 bg-transparent focus:outline-none"
                placeholder="0"
                onChange={handleInputChange}
              />
              <div className="col-span-2  flex flex-col gap-4 items-center mt-[1.5rem] relative">
                <select
                  disabled={!address}
                  onChange={handleTokenSelect}
                  className=" text-[.875em] w-fit  border-solid border-[1px] border-gray-400  bg-transparent rounded-full"
                  name="token"
                >
                  <option value="STRK">STRK</option>
                </select>
                <p className="absolute min-w-[120px] right-0 bottom-[.5rem] text-[.75em]">
                  Balance: {parseFloat(balance).toFixed(2)} STRK
                </p>
              </div>
            </div>
            <button
              disabled={!amount || sendingState === "sent"}
              onClick={async (e) => {
                e.preventDefault();
                await handleDonate(
                  amount,
                  account,
                  setSendingState,
                  campaignDetails.address,
                  handleRouteToCampaign
                );
              }}
              className=" bg-theme-green text-white py-3 px-6 rounded-[10px] w-full"
            >
              {sendingState}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
