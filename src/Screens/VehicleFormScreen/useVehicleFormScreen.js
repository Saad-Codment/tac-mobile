import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker'; // swap for your actual picker if different
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import API, {formDataFunc} from '../../Utils/helperFunc';
import {successMessage, errorMessage} from '../../Utils/helperFunc'; // adjust path if these live elsewhere
import {updateVehicleUrl, addVehicleUrl} from '../../Utils/Urls';
import {vehicleTypesUrl} from '../../Utils/Urls';

const MAX_IMAGES = 5;

const useVehicleFormScreen = (navigation, route) => {
  const {vehicle} = route?.params ?? {};
  const isEdit = !!vehicle;
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(vehicle?.title ?? '');
  const [name, setName] = useState(vehicle?.name ?? '');
  const [vehicleNumber, setVehicleNumber] = useState(
    vehicle?.vehicle_number ?? '',
  );
  const [horseStalls, setHorseStalls] = useState(
    vehicle?.horse_stalls ? String(vehicle.horse_stalls) : '',
  );
  const [humanSeats, setHumanSeats] = useState(
    vehicle?.human_seats ? String(vehicle.human_seats) : '',
  );
  const [heightCm, setHeightCm] = useState(
    vehicle?.height_cm ? String(vehicle.height_cm) : '',
  );
  const [widthCm, setWidthCm] = useState(
    vehicle?.width_cm ? String(vehicle.width_cm) : '',
  );
  const [lengthCm, setLengthCm] = useState(
    vehicle?.length_cm ? String(vehicle.length_cm) : '',
  );
  const [weightKg, setWeightKg] = useState(
    vehicle?.weight_kg ? String(vehicle.weight_kg) : '',
  );
  const [axleCount, setAxleCount] = useState(
    vehicle?.axle_count ? String(vehicle.axle_count) : '',
  );

  // NEW fields
  const [vehicleType, setVehicleType] = useState(vehicle?.vehicle_type ?? null);
  const [carriesHorses, setCarriesHorses] = useState(!!vehicle?.carries_horses);
  const [basePricePerHorse, setBasePricePerHorse] = useState(
    vehicle?.base_price_per_horse ? String(vehicle.base_price_per_horse) : '',
  );
  const [basePricePerSeat, setBasePricePerSeat] = useState(
    vehicle?.base_price_per_seat ? String(vehicle.base_price_per_seat) : '',
  );

  // NEW — vehicle type options for the dropdown, e.g. [{value:'horse_trailer', name:'Horse Trailer'}, ...]
  const vehicleTypesQuery = useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: () => API.get(vehicleTypesUrl),
  });
  const vehicleTypeOptions = (vehicleTypesQuery.data?.data?.data ?? []).map(
    t => ({
      label: t.name,
      value: t.value,
    }),
  );
  const isLoadingVehicleTypes = vehicleTypesQuery.isLoading;

  const images = useState(
    (vehicle?.images ?? []).map(path => ({uri: path, isEdit: true})),
  )[0];
  const [imageList, setImageList] = useState(
    (vehicle?.images ?? []).map(path => ({uri: path, isEdit: true})),
  );

  const pickImages = useCallback(() => {
    const remaining = MAX_IMAGES - imageList.length;
    if (remaining <= 0) {
      Alert.alert(
        'Limit Reached',
        `You can upload up to ${MAX_IMAGES} images.`,
      );
      return;
    }
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: remaining},
      response => {
        if (response.didCancel || response.errorCode) return;
        const picked = (response.assets ?? []).map(a => ({
          uri: a.uri,
          isEdit: false,
        }));
        setImageList(prev => [...prev, ...picked]);
      },
    );
  }, [imageList.length]);

  const removeImage = useCallback(index => {
    setImageList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const validate = () => {
    if (!title.trim()) return 'Title is required.';
    if (!name.trim()) return 'Name is required.';
    if (!vehicleNumber.trim()) return 'Vehicle number is required.';
    if (!vehicleType) return 'Vehicle type is required.';
    if (!horseStalls) return 'Horse stalls is required.';
    if (!humanSeats) return 'Human seats is required.';
    if (!heightCm) return 'Height is required.';
    if (!widthCm) return 'Width is required.';
    if (!lengthCm) return 'Length is required.';
    if (!weightKg) return 'Weight is required.';
    if (!axleCount) return 'Axle count is required.';
    return null;
  };

  const {mutate: saveVehicleMutate, isLoading: isSaving} = useMutation({
    mutationFn: body =>
      formDataFunc(
        isEdit ? `${updateVehicleUrl}${vehicle.id}` : addVehicleUrl,
        body,
        'images',
        true,
      ),
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(
          isEdit
            ? 'Vehicle updated successfully'
            : 'Vehicle created successfully',
        );
        queryClient.invalidateQueries({queryKey: ['vehiclesList']});
        navigation.goBack();
      } else {
        errorMessage(data?.message || 'Error saving vehicle');
      }
    },
    onError: () => errorMessage('Error saving vehicle'),
  });

  const saveVehicle = useCallback(() => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Missing Information', validationError);
      return;
    }

    const body = {
      title,
      name,
      vehicle_number: vehicleNumber,
      vehicle_type: vehicleType,
      carries_horses: carriesHorses ? 1 : 0,
      base_price_per_horse: basePricePerHorse || undefined,
      base_price_per_seat: basePricePerSeat || undefined,
      horse_stalls: horseStalls,
      human_seats: humanSeats,
      height_cm: heightCm,
      width_cm: widthCm,
      length_cm: lengthCm,
      weight_kg: weightKg,
      axle_count: axleCount,
      images: imageList.filter(img => !img.isEdit),
      ...(isEdit && {
        _method: 'PUT',
        images_array: JSON.stringify(
          imageList.filter(img => img.isEdit).map(img => img.uri),
        ),
      }),
    };

    saveVehicleMutate(body);
  }, [
    title,
    name,
    vehicleNumber,
    vehicleType,
    carriesHorses,
    basePricePerHorse,
    basePricePerSeat,
    horseStalls,
    humanSeats,
    heightCm,
    widthCm,
    lengthCm,
    weightKg,
    axleCount,
    imageList,
    isEdit,
    saveVehicleMutate,
  ]);

  return {
    isEdit,
    title,
    setTitle,
    name,
    setName,
    vehicleNumber,
    setVehicleNumber,
    horseStalls,
    setHorseStalls,
    humanSeats,
    setHumanSeats,
    heightCm,
    setHeightCm,
    widthCm,
    setWidthCm,
    lengthCm,
    setLengthCm,
    weightKg,
    setWeightKg,
    axleCount,
    setAxleCount,
    images: imageList,
    pickImages,
    removeImage,
    saveVehicle,
    isSaving,
    // NEW
    vehicleType,
    setVehicleType,
    vehicleTypeOptions,
    isLoadingVehicleTypes,
    carriesHorses,
    setCarriesHorses,
    basePricePerHorse,
    setBasePricePerHorse,
    basePricePerSeat,
    setBasePricePerSeat,
  };
};

export default useVehicleFormScreen;
