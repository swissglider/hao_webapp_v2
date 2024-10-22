<script>
  import { each } from "dom7";
  import { List, ListInput, Segmented, Button } from "framework7-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let automation;
  export let automationMapping;
  export let shellybuttonlabeld;
  export let isNew = false;

  //export let shellyButtonEntityName = automationMapping.shellyButtonEntityName;
  //let shellyButtonFriendlyName = automationMapping.shellyButtonFriendlyName;
  let automationName;
  let automationDescription;
  let shellyButtonEntityID;
  let hueType;
  let hueAreaEntityName;
  let hueSceneEntityName;

  const reset = () => {
    shellyButtonEntityID = isNew
      ? ""
      : automationMapping.shellyButtonEntityName;
    hueType = isNew ? "" : automationMapping.hueType;
    hueAreaEntityName = isNew ? "" : automationMapping.hueAreaEntityName;
    hueSceneEntityName = isNew ? "" : automationMapping.hueSceneEntityName;
    automationName = isNew ? "" : automation.alias;
    automationDescription = isNew ? "" : automation.description;
  };
  reset();

  const cancelAutomation = () => {
    console.log("cancel");
    dispatch("cancel");
  };

  const updateAutomation = () => {
    const toSave = {
      newValue: {
        automationName,
        automationDescription,
        shellyButtonEntityID,
        hueType,
        hueAreaEntityName,
        hueSceneEntityName,
      },
      inputValue: { automation, automationMapping, shellybuttonlabeld },
    };
    console.log("update", toSave);
    dispatch("update", toSave);
  };

  const addNewAutomation = () => {
    const toSave = {
      newValue: {
        automationName,
        automationDescription,
        shellyButtonEntityID,
        hueType,
        hueAreaEntityName,
        hueSceneEntityName,
      },
    };
    console.log("addnew", toSave);
    dispatch("addnew", toSave);
  };

  // --------------------------------------------
  // shelly button list
  // --------------------------------------------

  $: shellyButtons =
    automationName &&
    automationName != "" &&
    automationDescription &&
    automationDescription != ""
      ? shellybuttonlabeld.shelly_buttons
      : [];

  const onChangeShellyButtonEntityID = (e) => {
    hueType = "";
    hueAreaEntityName = "";
    hueSceneEntityName = "";
  };

  // --------------------------------------------
  // hue type
  // --------------------------------------------

  $: hueTypes =
    shellyButtonEntityID && shellyButtonEntityID != ""
      ? Object.keys(shellybuttonlabeld.hue_areas)
      : [];

  const onChangeHueType = (e) => {
    hueAreaEntityName = "";
    hueSceneEntityName = "";
  };

  // --------------------------------------------
  // hue areas
  // --------------------------------------------

  $: hueAreas =
    hueType && hueType != "" ? shellybuttonlabeld.hue_areas[hueType] : [];

  const onChangeHueAreaEntityName = (e) => {
    hueSceneEntityName = "";
  };

  // --------------------------------------------
  // hue scenes
  // --------------------------------------------

  $: hueScenes =
    hueAreaEntityName && hueAreaEntityName != ""
      ? shellybuttonlabeld.hue_areas[hueType].find(
          (area) => area.hue_area_entity_id === hueAreaEntityName
        ).hue_scenes
      : [];

  // --------------------------------------------
  // reactive to show variables
  // --------------------------------------------

  $: toShowShellyButton =
    automationName &&
    automationName != "" &&
    automationDescription &&
    automationDescription != "";

  $: showHueTypes =
    toShowShellyButton &&
    shellybuttonlabeld?.shelly_buttons?.some(
      (e) => e.entity_id === shellyButtonEntityID
    );

  $: showHueAreas = showHueTypes && hueType;

  $: showHueScene =
    showHueAreas &&
    shellybuttonlabeld.hue_areas[hueType].some(
      (area) => area.hue_area_entity_id === hueAreaEntityName
    );

  $: toSave =
    automationName !== "" &&
    automationDescription !== "" &&
    shellyButtonEntityID !== "" &&
    hueType !== "" &&
    hueAreaEntityName !== "" &&
    hueSceneEntityName !== "" &&
    !(
      !isNew &&
      automationName === automation.alias &&
      automationDescription === automation.description &&
      shellyButtonEntityID === automationMapping.shellyButtonEntityName &&
      hueType === automationMapping.hueType &&
      hueAreaEntityName === automationMapping.hueAreaEntityName &&
      hueSceneEntityName === automationMapping.hueSceneEntityName
    );
</script>

<!-- {hueAreaEntityName} = {shellybuttonlabeld.hue_areas[hueType].find(
  (area) => area.hue_area_entity_id === hueAreaEntityName
).hue_area_name} -->

<List outlineIos dividersIos form formStoreData id="demo-form">
  <ListInput
    label="Automation Name - {automationName}"
    type="text"
    placeholder="Automation Name"
    bind:value={automationName}
    outline
    required
  ></ListInput>
  <ListInput
    label="Automation Description - {automationDescription}"
    type="text"
    placeholder="Automation Description"
    bind:value={automationDescription}
    outline
    required
  ></ListInput>
  {#if toShowShellyButton}
    <ListInput
      label="Shelly Button - {shellyButtonEntityID}"
      type="select"
      bind:value={shellyButtonEntityID}
      outline
      required
      on:change={onChangeShellyButtonEntityID}
    >
      <option value="">Please choose...</option>
      {#each shellyButtons as shellyButton}
        <option value={shellyButton.entity_id}>
          {shellyButton.friendly_name}
        </option>
      {/each}
    </ListInput>
  {/if}

  {#if showHueTypes}
    <ListInput
      label="Room or Zone - {hueType} - {showHueTypes}"
      type="select"
      bind:value={hueType}
      outline
      required
      on:change={onChangeHueType}
    >
      <option value="">Please choose...</option>
      {#each hueTypes as hue_area_type}
        <option value={hue_area_type}>
          {hue_area_type}
        </option>
      {/each}
    </ListInput>
  {/if}

  {#if showHueAreas}
    <ListInput
      label="Hue Room / Zone - {hueAreaEntityName}"
      type="select"
      bind:value={hueAreaEntityName}
      outline
      required
      on:change={onChangeHueAreaEntityName}
    >
      <option value="">Please choose...</option>
      {#each hueAreas as hue_area}
        <option value={hue_area.hue_area_entity_id}>
          {hue_area.hue_area_name}
        </option>
      {/each}</ListInput
    >
  {/if}

  {#if showHueScene}
    <ListInput
      label="Hue Scene - {hueSceneEntityName}"
      type="select"
      placeholder="Please choose..."
      bind:value={hueSceneEntityName}
      outline
      required
    >
      <option value="">Please choose...</option>
      {#each hueScenes as hue_scene}
        <option value={hue_scene.scene_entity_id}>
          {hue_scene.scene_name}
        </option>
      {/each}</ListInput
    >
  {/if}
  <Segmented round raised tag="p">
    {#if !isNew}
      <Button round on:click={reset}>Reset</Button>
      {#if toSave}<Button round on:click={updateAutomation}>Update</Button>{/if}
    {/if}
    {#if isNew}
      <Button round on:click={cancelAutomation}>Cancel</Button>
      {#if toSave}<Button round on:click={addNewAutomation}>Add New</Button
        >{/if}
    {/if}
  </Segmented>
</List>
