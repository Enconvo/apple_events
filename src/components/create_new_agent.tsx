import { Action, ResponseAction, Form, TextField, showToast, LoadingIndicator, TextArea, Command, generateNameString, popToRoot, ToolPicker } from "@enconvo/api";
import { useState } from "react";

type Values = {
    title: string;
    prompt: string;
    description: string;
    tools: {
        command: string;
        title: string;
    }[];
};


export default function App() {
    const [state, setState] = useState("create")
    const [loadingText, setLoadingText] = useState("loading")

    const actions: ResponseAction[] = [
        Action.SubmitForm({
            onSubmit: async (data: Values) => {

                if (!data.title) {
                    showToast({
                        title: 'Please enter title'
                    })
                    return;
                }

                try {
                    setState("loading")


                    showToast({
                        title: 'Agent created successfully'
                    })

                    setState("created")
                } catch (e) {
                    console.log("e:", e)
                    setState("create")
                    //@ts-ignore
                    showToast(`create agent failed,${e.message}`)
                }

            }
        })
    ]

    return (
        <>
            {state === "create" &&
                <Form actions={actions}>
                    <TextField
                        focus={true}
                        id="title"
                        title="Tile"
                        description="Let's give the agent a name!"
                        placeHolder="Enter agent title"
                    />

                    <TextField
                        id="description"
                        title="Description"
                        description="Let's give the agent a description, this is useful for the agent to understand the user's intent"
                        placeHolder="Enter agent description"
                    />

                    <TextArea
                        id="prompt"
                        title="Prompt"
                        description="Enter a prompt for the agent"
                        placeHolder="Enter a prompt for the agent"
                        defaultValue="You are a helpful AI assistant on macOS. 

Always remember the user's initial goal; if it isn't accomplished, continue to try new solutions. 
If an error occurs while executing the tool, provide a new solution based on the error information. 

Before using any tool, state your plan."
                    />

                    <ToolPicker
                        id="tools"
                        title="Tools"
                        description="Select tools for the agent"
                    />



                </Form>
            }

            {state === "loading" &&
                <Form actions={[]}>
                    <LoadingIndicator text={loadingText} />
                </Form>
            }

            {state === "created" &&
                <Form actions={[]}>
                    <div>Agent has been created. Use the SmartBar to interact with your agent.</div>
                </Form>
            }

        </>
    );
}

