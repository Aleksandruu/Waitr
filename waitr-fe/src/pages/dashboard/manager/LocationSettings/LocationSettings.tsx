import { useForm } from "react-hook-form";
import styles from "./LocationSettings.module.scss";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "waitr-fe/src/base_components/Input/Input";
import ColorSliders from "waitr-fe/src/base_components/ColorSlider/ColorSlider";
import Button from "waitr-fe/src/base_components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { locationActions } from "waitr-fe/src/pages/Location.slice";
import { useEffect, useRef, useState } from "react";
import {
  useGetLocationSettingsQuery,
  useUpdateSettingsMutation,
} from "waitr-fe/src/api/managerApi";
import { RootState } from "waitr-fe/src/store";
import { useNavigate } from "@tanstack/react-router";
import { LocationSettings as LocationSettingsModel } from "shared/models/locationSettings.model";
import ImageInput from "waitr-fe/src/base_components/ImageInput/ImageInput";
import { bufferToFile } from "waitr-fe/src/helpers/byteArrayToFile";

type LocationSettingsProps = {
  // props here
};

const settingsSchema = yup.object({
  name: yup.string().required("Name is required"),
  slug: yup.string().required("Slug is required"),
  color: yup.string().required("Accent color is required"),
});

type FormData = yup.InferType<typeof settingsSchema>;

const LocationSettings = ({}: LocationSettingsProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data } = useGetLocationSettingsQuery();
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const initialColor = useSelector((state: RootState) => state.location.color);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedLogo, setSelectedLogo] = useState<File | undefined>(undefined);
  const [locationSettings, setLocationSettings] = useState<
    LocationSettingsModel | undefined
  >();
  const savedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(settingsSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const currentData = data;
    return () => {
      dispatch(
        locationActions.changeColorFromSettings(
          localStorage.getItem("locationColor")!
        )
      );
      if (currentData?.logo && !savedRef.current) {
        dispatch(locationActions.changeLogoBuffer(currentData?.logo));
        dispatch(locationActions.changeLogoMime(currentData?.logoMime!));
      }
    };
  }, [dispatch, data]);

  useEffect(() => {
    if (data) {
      setLocationSettings({
        color: data.color,
        name: data.name,
        slug: data.slug,
        logo: data.logo ? bufferToFile(data.logo!, data.logoMime!) : undefined,
      });
      reset({
        name: data.name ?? "",
        slug: data.slug ?? "",
        color: selectedColor,
      });
    }
  }, [data, reset]);

  const changeColor = (color: string) => {
    setSelectedColor(color);
    dispatch(locationActions.changeColorFromSettings(color));
  };

  const changeLogo = async (logo: File) => {
    setSelectedLogo(logo);
    const arrayBuffer = await logo.arrayBuffer();
    const buffer: {
      type: "Buffer";
      data: number[] | Uint8Array;
    } = {
      type: "Buffer",
      data: Array.from(new Uint8Array(arrayBuffer)),
    };
    dispatch(locationActions.changeLogoBuffer(buffer));
    dispatch(locationActions.changeLogoMime(logo.type));
  };

  const onSubmit = (data: FormData) => {
    data.color = selectedColor!;
    savedRef.current = true;
    const settings: LocationSettingsModel = {
      ...data,
      logo: selectedLogo,
    };
    updateSettings(settings).unwrap();
    localStorage.setItem("locationColor", selectedColor!);
    navigate({ to: "/dashboard/manager" });
  };

  return (
    <div className="container">
      <div className="middle-column-container">
        <h1>Location Settings</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            type="text"
            placeholder="Location name"
            register={register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Slug"
            type="text"
            placeholder="Location slug"
            register={register("slug")}
            error={errors.slug?.message}
          />
          <ColorSliders setColor={changeColor} color={initialColor!} />
          {!!locationSettings ? (
            <ImageInput
              name="Logo"
              onChange={changeLogo}
              initialImage={
                locationSettings!.logo ? locationSettings!.logo : undefined
              }
              small="Here you can upload or update your logo. We recommend uploading an image with a transparent background for the best results!"
            ></ImageInput>
          ) : (
            ""
          )}
          <Button
            text="Save"
            color="brand"
            submit={true}
            tall={true}
            wide={false}
            loading={isLoading}
            disabled={!isValid}
          ></Button>
        </form>
      </div>
    </div>
  );
};

export default LocationSettings;
