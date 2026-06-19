import {useEffect} from 'react';
import * as yup from 'yup';
import useFormHook from '../../Hooks/UseFormHooks';
import {useMutation, useQuery} from '@tanstack/react-query';
import API, {formDataFunc} from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import {
  addVehicleUrl,
  getVehicleDetailsUrl,
  imageUrl,
  updateVehicleUrl,
} from '../../Utils/Urls';
import Schemas from '../../Utils/Validation';

const useTruckAddScreen = ({navigate, goBack}, {params}) => {
  const {truck} = params?.truck ? params : {truck: null};
  const isEditTruck = Boolean(truck?.id);

  const {queryClient} = useReduxStore();

  // ── Fetch truck details for edit mode ──
  const {data} = useQuery({
    queryKey: ['truckDetailForEdit', truck?.id],
    enabled: isEditTruck,
    queryFn: async () => {
      const res = await API.get(getVehicleDetailsUrl + truck?.id);
      if (res?.ok) {
        const d = res.data?.data;

        console.log('truck details for edit', d);
        setValue('vehicle_number', d?.vehicle_number || '');
        setValue(
          'truckImg',
          d?.image_url
            ? [d.image_url].map(img => ({
                uri: img,
                type: 'image/jpeg',
                name: img.split('/').pop(),
                isEdit: true,
              }))
            : [],
        );
        setValue('name', d?.name || '');
        setValue('horse_stalls', d?.horse_stalls ?? '');
        setValue('human_seats', d?.human_seats ?? '');
        setValue('height_cm', d?.height_cm ?? '');
        setValue('weight_kg', d?.weight_kg ?? '');
        setValue('axle_count', d?.axle_count ?? '');
        setValue('length_cm', d?.length_cm ?? '');
        setValue('width_cm', d?.width_cm ?? '');
      }
      return res;
    },
  });

  // ── Form ──
  const {
    control,
    register,
    handleSubmit,
    reset,
    getFieldState,
    setValue,
    errors,
  } = useFormHook(Schemas.truckAdd, {
    vehicle_number: '',
    truckImg: [],
    name: '',
    horse_stalls: '',
    human_seats: '',
    height_cm: '',
    weight_kg: '',
    axle_count: '',
    length_cm: '',
    width_cm: '',
  });

  useEffect(() => {
    return () => reset();
  }, []);

  // ── Submit ──
  const createTruckFun = async ({
    vehicle_number,
    truckImg,
    name,
    horse_stalls,
    human_seats,
    height_cm,
    weight_kg,
    axle_count,
    length_cm,
    width_cm,
  }) => {
    try {
      const body = {
        vehicle_number,
        name,
        horse_stalls,
        human_seats,
        height_cm,
        weight_kg,
        axle_count,
        length_cm,
        width_cm,
        image: truckImg[0]?.isEdit ? null : truckImg[0],
        // images: isEditTruck
        //   ? truckImg?.find(res => !res?.isEdit)
        //     ? truckImg?.filter(res => !res?.isEdit)
        //     : null
        //   : truckImg,
      };

      const {ok, data} = await formDataFunc(
        isEditTruck ? updateVehicleUrl + truck?.id : addVehicleUrl,
        body,
        'image',
        false,
      );

      if (ok) {
        console.log('Truck saved successfully:', data);
        if (params?.functionToUpdatePostOrTruck) {
          params?.functionToUpdatePostOrTruck(data);
        }
        queryClient.invalidateQueries({queryKey: ['getTrucks']});
        successMessage(
          isEditTruck
            ? 'Truck updated successfully'
            : 'Truck added successfully',
        );
        goBack();
      } else {
        console.log('Error saving truck:', data);

        errorMessage(
          isEditTruck ? 'Error on updating truck' : 'Error on adding truck',
        );
      }
    } catch (error) {
      console.log('Error saving truck:', error);
    }
  };

  return {
    errors,
    control,
    register,
    handleSubmit,
    getFieldState,
    setValue,
    isEditTruck,
    createTruckFun,
  };
};

export default useTruckAddScreen;
