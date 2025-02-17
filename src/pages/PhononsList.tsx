import {
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CreatePhononButton from "../components/CreatePhononButton";
import SessionNameHeader from "../components/SessionNameHeader";
import PhononListItem from "../components/PhononListItem";
import ReceivePhononButton from "../components/ReceivePhononButton";
import RedeemPhononButton from "../components/RedeemPhononButton";
import SendPhononButton from "../components/SendPhononButton";
import { useSession } from "../hooks/useSession";
import Layout from "../layout/Layout";
import { useFetchPhononsQuery } from "../store/api";

const PhononsList: React.FC = () => {
  const { sessionId, activeSession, isSessionLoading } = useSession();
  const router = useIonRouter();

  const [selectedPhonon, setSelectedPhonon] = useState<PhononDTO>();
  const { data, refetch, isLoading, isFetching, isError } =
    useFetchPhononsQuery({
      sessionId,
    });

  if (isError || (!isSessionLoading && !activeSession)) {
    //TODO: Improve how this works. It's a bit hacky.
    router.push("/");
    window.location.reload();
  }

  function refresh(event: CustomEvent<any>) {
    refetch();
    event.detail.complete();
  }

  return (
    <Layout>
      <SessionNameHeader />
      <div className="flex my-3 justify-evenly items-center">
        <CreatePhononButton />
        <SendPhononButton phonon={selectedPhonon} />
        <RedeemPhononButton phonon={selectedPhonon} />
        <ReceivePhononButton />
      </div>

      {isLoading || isFetching ? (
        <div className="w-full flex justify-center align-middle">
          <IonSpinner />
        </div>
      ) : (
        <>
          <IonRefresher
            slot="fixed"
            onIonRefresh={refresh}
            closeDuration={"50ms"}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {data?.map((p) => (
              <ErrorBoundary
                FallbackComponent={({ error }) => (
                  <div className="p-3 uppercase font-black">
                    <p className="text-xs">Failed to load phonon</p>
                    <p className="text-xs text-red-400">{error.message}</p>
                  </div>
                )}
                key={p.PubKey}
              >
                <PhononListItem
                  phonon={p}
                  {...{ selectedPhonon, setSelectedPhonon }}
                />
              </ErrorBoundary>
            ))}
          </IonList>
        </>
      )}
    </Layout>
  );
};

export default PhononsList;
