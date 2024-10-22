<script>
  import {
    Page,
    Navbar,
    List,
    ListItem,
    Block,
    Button,
    Icon,
    NavLeft,
    NavTitle,
    NavRight,
    NavTitleLarge,
    Link,
    AccordionContent,
    SwipeoutActions,
    SwipeoutButton,
    Fab,
    BlockTitle,
    Popup,
    View,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { f7 } from "framework7-svelte";

  import ShellyButtonHueArea_SimpleView from "../components/shellyButtonHueArea_SimpleView.svelte";

  let automations = [];
  let shellybuttonlabeld = [];

  const loadAutomations = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/data/shellybutton_huearea_automation"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch automations");
      }
      automations = (await response.json()).data;
      console.log(automations);
    } catch (error) {
      f7.dialog.alert(error.message, "Error");
    }
  };

  const loadShellybuttonlabeld = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/data/shellybuttonlabeld"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch ");
      }
      shellybuttonlabeld = (await response.json()).data;
    } catch (error) {
      f7.dialog.alert(error.message, "Error");
    }
  };

  const updateAutomation = (event) => {
    console.log(event.detail);
    f7.dialog.alert(
      `Update automation with id: ${event.detail.inputValue.automation.id}`,
      "Update"
    );
  };

  const addNewAutomation = (event) => {
    console.log(event.detail);
    f7.dialog.alert(`Add new automation`, "Add");
    newAutomationPopupComponent.instance().close(true);
  };

  const cancelAutomation = () => {
    newAutomationPopupComponent.instance().close(true);
  };

  const deleteAutomation = (id) => {};

  const onDeleted = (automation) => {
    f7.dialog.alert(
      `Thanks, item removed! - ${automation.alias} [${automation.id}]`
    );
    deleteAutomation(automation.id);
  };

  const getAutomationMap = (automation) => {
    const sb_entityName = automation?.trigger[0]?.entity_id[0];
    const sb_friendly_name = shellybuttonlabeld?.shelly_buttons?.find(
      (b) => b.entity_id === sb_entityName
    ).friendly_name;
    const hue_area = [
      ...shellybuttonlabeld.hue_areas?.room,
      ...shellybuttonlabeld.hue_areas?.zone,
    ]?.find((area) =>
      area.hue_scenes.some(
        (scene) =>
          scene.scene_entity_id ===
          automation.action[0].else[0].target.entity_id
      )
    );
    const hue_scene = hue_area.hue_scenes.find(
      (scene) =>
        scene.scene_entity_id === automation.action[0].else[0].target.entity_id
    );
    return {
      shellyButtonEntityName: sb_entityName,
      shellyButtonFriendlyName: sb_friendly_name,
      hueType: hue_area.hue_type,
      hueAreaEntityName: hue_area.hue_area_entity_id,
      hueAreaFriendlyName: hue_area.hue_area_name,
      hueSceneEntityName: hue_scene.scene_entity_id,
      hueSceneFriendlyName: hue_scene.scene_name,
    };
  };

  const pageMounted = (e) => {
    console.log("pageMounted");
  };

  const pageInit = (e) => {
    console.log("pageInit");
  };

  const pageReinit = (e) => {
    console.log("pageReinit");
  };

  const pageBeforeIn = (e) => {
    console.log("pageBeforeIn");
  };

  const pageBeforeOut = (e) => {
    console.log("pageBeforeOut");
  };

  const pageTabShow = (e) => {
    console.log("pageTabShow");
  };

  const pageTabHide = (e) => {
    console.log("pageTabHide");
  };

  const ptrPullStart = (e) => {
    console.log("ptrPullStart");
  };

  const ptrRefresh = (e) => {
    console.log("ptrRefresh");
  };

  onMount(async () => {
    console.log("onMount");
    await loadShellybuttonlabeld();
    await loadAutomations();
    console.log(shellybuttonlabeld);
  });

  let newAutomationPopupComponent = undefined;
</script>

<Page
  name="automations"
  hideToolbarOnScroll
  on:pageMounted={pageMounted}
  on:pageInit={pageInit}
  on:pageReinit={pageReinit}
  on:pageBeforeIn={pageBeforeIn}
  on:pageTabShow={pageTabShow}
  on:pageTabHide={pageTabHide}
  on:pageBeforeOut={pageBeforeOut}
  on:ptrPullStart={ptrPullStart}
  on:ptrRefresh={ptrRefresh}
>
  <!-- Top Navbar -->
  <Navbar>
    <NavLeft>
      <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
    </NavLeft>
    <NavTitle sliding>Automations</NavTitle>
    <NavRight>
      <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="right" />
    </NavRight>
  </Navbar>
  <List dividersIos mediaList outlineIos strong accordionList>
    {#each automations as automation}
      <ListItem
        title={automation.alias}
        subtitle={automation.description}
        accordionItem
        swipeout
        onSwipeoutDeleted={() => onDeleted(automation)}
      >
        <SwipeoutActions right>
          <SwipeoutButton
            delete
            confirmTitle="Delete ?"
            confirmText="Are you sure you want to delete Automation: {automation.alias} "
          >
            Delete
          </SwipeoutButton>
        </SwipeoutActions>
        <AccordionContent>
          <Block outline inset>
            <ShellyButtonHueArea_SimpleView
              automationMapping={getAutomationMap(automation)}
              {automation}
              {shellybuttonlabeld}
              isNew={false}
              on:update={updateAutomation}
              on:addnew={addNewAutomation}
              on:cancel={cancelAutomation}
            />
          </Block>
        </AccordionContent>
      </ListItem>
    {/each}
  </List>
  <Fab
    position="right-bottom"
    on:click={() => {
      console.log("Hallo");
      newAutomationPopupComponent.instance().open(true);
    }}
  >
    <Icon ios="f7:plus" md="material:add" />
  </Fab>
</Page>

<!-- Popup -->
<Popup
  bind:this={newAutomationPopupComponent}
  onPopupClosed={() => newAutomationPopupComponent.instance().close(true)}
>
  <View>
    <Page>
      <Navbar title="New Automation"></Navbar>
      <Block>
        <p>Popup content goes here.</p>
      </Block>
      <ShellyButtonHueArea_SimpleView
        automationMapping={undefined}
        automation={undefined}
        {shellybuttonlabeld}
        isNew={true}
        on:update={updateAutomation}
        on:addnew={addNewAutomation}
        on:cancel={() => cancelAutomation()}
      />
    </Page>
  </View>
</Popup>
