import { useForm } from "react-hook-form";
import styles from "./LocationSettings.module.scss";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "waitr-fe/src/base_components/Input/Input";
import ColorSliders from "waitr-fe/src/base_components/ColorSlider/ColorSlider";
import Button from "waitr-fe/src/base_components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  locationActions,
  LocationState,
} from "waitr-fe/src/pages/Location.slice";
import { useEffect, useState } from "react";
import {
  useGetLocationSettingsQuery,
  useUpdateSettingsMutation,
} from "waitr-fe/src/api/managerApi";
import { RootState } from "waitr-fe/src/store";
import { useNavigate } from "@tanstack/react-router";
import { UpdateLocationSettingsDto } from "shared";
import ImageInput from "waitr-fe/src/base_components/ImageInput/ImageInput";
import { bufferToFile } from "waitr-fe/src/helpers/byteArrayToFile";
import { FileBuffer } from "shared/models/fileBuffer.model";

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

  const { data } = useGetLocationSettingsQuery(undefined);
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const settings = useSelector((state: RootState) => {
    return state.location as LocationState;
  });

  const [selectedLogo, setSelectedLogo] = useState<File | undefined>(undefined);

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
    dispatch(locationActions.saveInitialState());
  }, [dispatch, data]);

  useEffect(() => {
    return () => {
      dispatch(locationActions.goBackToInitialState());
    };
  }, []);

  useEffect(() => {
    if (data) {
      setSelectedLogo(
        data.logo ? bufferToFile(data.logo!, data.logoMime!) : undefined
      );
      reset({
        name: data.name ?? "",
        slug: data.slug ?? "",
        color: settings.color,
      });
    }
  }, [data, reset]);

  const changeColor = (color: string) => {
    dispatch(locationActions.changeColorFromSettings(color));
  };

  const changeLogo = async (logo: File) => {
    setSelectedLogo(logo);
    const arrayBuffer = await logo.arrayBuffer();
    const buffer: FileBuffer = {
      type: "Buffer",
      data: Array.from(new Uint8Array(arrayBuffer)),
    };
    dispatch(locationActions.changeLogoBuffer(buffer));
    dispatch(locationActions.changeLogoMime(logo.type));
  };

  const onSubmit = () => {
    const finalSettings: UpdateLocationSettingsDto = {
      ...settings,
      logo: selectedLogo,
    };
    updateSettings(finalSettings).unwrap();
    localStorage.setItem("locationColor", settings.color!);
    navigate({ to: "/dashboard/manager" });
  };

  return (
    <div className="container">
      <div className="middle-column-container">
        <h1>Location Settings</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="name"
            label="Name"
            type="text"
            placeholder="Location name"
            register={register("name")}
            error={errors.name?.message}
            onChange={(event) => {
              register("name").onChange(event);
              dispatch(locationActions.setName(event.target.value));
            }}
          />
          <Input
            name="slug"
            label="Slug"
            type="text"
            placeholder="Location slug"
            register={register("slug")}
            error={errors.slug?.message}
            onChange={(event) => {
              register("slug").onChange(event);
              dispatch(locationActions.setSlug(event.target.value));
            }}
          />
          <ColorSliders setColor={changeColor} color={settings.color!} />
          {!!settings ? (
            <ImageInput
              name="Logo"
              onChange={changeLogo}
              initialImage={selectedLogo}
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
